const router = require("express").Router();
const auth = require("../middleware/auth");

const Blogs = require("../models/blog");

// Get All the blogs
router.get("/", async (_, res) => {
  try {
    const blogs = await Blogs.find();

    if (blogs) return res.status(200).json(blogs);
    return res.status(404).json({ err: "There is no Blogs" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Oops Something went wrong" });
  }
});

// Get One Blog
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.findOne({ _id: id });

    if (blog) {
    const dateobj = blog.createdAt ? new Date(blog.createdAt) : new Date();
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  // format the date
  const createdAt =
    pad(date.getDate()) +
    "/" +
    pad(date.getMonth() + 1) +
    "/" +
    date.getFullYear();
    return res.status(200).json({...blog,createdAt});
    
    }
    return res.status(404).json({ err: "There is no Blog with that id" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Oops Something went wrong" });
  }
});
// Create a Blog
router.post("/", auth, async (req, res) => {
  try {
    let { title, short, long, categories } = req.body;

    if ((!title || !short || !long, !categories)) {
      return res.json({ err: "Please fill all the fields" });
    }

    title = title.toLowerCase();
    categories = categories.map((c) => c.toLowerCase());

    const blog = await Blogs.findOne({ title });
    if (blog) {
      return res.json({ err: "There is another blog with that exact title" });
    }

    const newBlog = new Blogs({
      title,
      short,
      long,
      categories,
    });

    await newBlog.save();
    res.json({ msg: "blog is created" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

// update blog
router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    let { title, short, long, categories } = req.body;

    title = title.toLowerCase();
    categories = categories.map((c) => c.toLowerCase());

    const updatedBlog = await Blogs.updateOne(
      { _id: id },
      {
        $set: {
          title,
          short,
          long,
          categories,
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
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const deleted = await Blogs.deleteOne({ _id: id });

  if (deleted.deletedCount === 1) return res.json({ msg: "Delete Success" });
});

router.patch("/like", (req, res) => {
  const { blogId, ip } = req.body;
  Blogs.updateOne(
    { _id: blogId },
    {
      // just add the ip if that ip is not exist
      $addToSet: { likes: ip },
    },
    { new: true }
  ).exec((err, data) => {
    if (err) return res.status(422).json({ error: err });
    res.status(200).json(data);
  });
});

router.patch("/unlike", (req, res) => {
  const { blogId, ip } = req.body;

  Blogs.updateOne(
    { _id: blogId },
    {
      $pull: { likes: ip },
    },
    { new: true }
  ).exec((err, data) => {
    if (err) return res.status(422).json({ error: err });
    res.status(200).json(data);
  });
});

module.exports = router;
