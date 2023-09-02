import express, { Request, Response } from "express";
import { auth, userIsAdmin } from "../middleware/auth";

import Blogs from "../models/blog";
import ViewsCount from "../models/views";
import mongoose from "mongoose";

const { ObjectId } = mongoose.mongo;
const router = express.Router();
// Get All the blogs
router.get("/", userIsAdmin, async (req: Request, res: Response) => {
	try {
		const { pages } = req.query;
		let blogs;

		if (req.isAuthorized) {
			// return by date
			blogs = await Blogs.find()
				.lean()
				.skip(+pages! * 10 || 0)
				.limit(10)
				.sort({ updatedAt: -1 });
		} else {
			blogs = await Blogs.find({ private: false })
				.lean()
				.skip(+pages! * 10 || 0)
				.limit(10)
				.sort({ updatedAt: -1 });
		}

		if (blogs.length) {
			return res.status(200).json({ blogs, pages: +pages! + 1 || 1 });
		}
		return res.status(404).json({ err: "There is no Blogs" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ err: "Oops Something went wrong" });
	}
});

// Get One Blog
router.get("/:id", userIsAdmin, async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const blog = await Blogs.findOne({ _id: id }).lean();
		if (!blog) return res.status(404).json({ err: "Can't find blog" });
		if (blog!.private === "true" && !req.isAuthorized) {
			return res.status(401).json({ err: "You're Not Authorized" });
		}
		if (blog) {
			const views = await ViewsCount.findOne({ blogId: id }).lean();

			// Increment the ViewsCount for this blog
			await ViewsCount.updateOne(
				{ blogId: id },
				{
					$inc: {
						counter: 1,
					},
				}
			);

			// merge the two objects and return the response
			const output = { ...blog, counter: views!.counter + 1 };
			return res.status(200).json(output);
		}
		return res.status(404).json({ err: "There is no Blog with that id" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ err: "Oops Something went wrong" });
	}
});
// Create a Blog
router.post("/", auth, async (req: Request, res: Response) => {
	try {
		let { title, img_url, short, long, categories, private: p } = req.body;

		if (!title || !short || !long || !categories) {
			return res.json({ err: "Please fill all the fields" });
		}

		title = title.trim();
		short = short.trim();
		long = long.trim();
		img_url = img_url.trim();

		const caseInsensetive = { $regex: new RegExp("^" + title + "$", "i") };
		categories = categories.map((c) => c.toLowerCase());

		const blog = await Blogs.findOne({ title: caseInsensetive });

		if (blog) {
			return res
				.status(400)
				.json({ err: "There is another blog with that exact title" });
		}

		const newBlog = new Blogs({
			title,
			img_url,
			short,
			long,
			categories,
			private: p,
		});

		// save the new Blog
		const newBlogSaved = await newBlog.save();

		// create viewsCounter
		new ViewsCount({
			blogId: new ObjectId(newBlogSaved._id),
		}).save();

		res.json({ msg: "blog is created" });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
});

// update blog
router.patch("/:id", auth, async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		let { title, img_url, short, long, categories, private: p } = req.body;
		const caseInsensetive = { $regex: new RegExp("^" + title + "$", "i") };
		const blog = await Blogs.findOne({
			title: caseInsensetive,
			_id: { $ne: id },
		});

		if (blog) {
			return res
				.status(400)
				.json({ err: "There is another blog with that exact title" });
		}

		categories = categories.map((c) => c.toLowerCase());
		title = title.trim();
		short = short.trim();
		long = long.trim();
		img_url = img_url.trim();

		const updatedBlog = await Blogs.updateOne(
			{ _id: id },
			{
				$set: {
					title,
					img_url,
					short,
					long,
					categories,
					private: p,
				},
			}
		);

		if (updatedBlog.acknowledged && updatedBlog.modifiedCount === 1)
			return res.status(200).json({ msg: "Update Success!" });
		return res.status(500).json({ err: "Somethong wrong" });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
});

// delete a Blog
router.delete("/:id", auth, async (req: Request, res: Response) => {
	const { id } = req.params;
	const deleted = await Blogs.deleteOne({ _id: id });

	await ViewsCount.deleteOne({ blogId: id });

	if (deleted.deletedCount === 1) return res.json({ msg: "Delete Success" });
	return res.json({ msg: "oOps Something went wrong" });
});

export default router;
