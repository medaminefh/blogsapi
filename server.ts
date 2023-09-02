import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
const PORT = process.env.PORT || 5000;
import express, { Response } from "express";
import { createLazyRouter } from "express-lazy-router";
import { notFound, errorHandler } from "./middleware/auth";

const app = express();
const lazyLoad = createLazyRouter({
	// In production, Load router asap
	preload: process.env.NODE_ENV === "production",
});
app.use(morgan("dev"));
app.use(helmet());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// connect db
require("./config");

// Home route
app.get("/", (_, res: Response) => {
	res.send("<h2>Hello World 🎉</h2>");
});

// create all the viewsCount documents corresponds to every blog
/* app.get("/test", async (_, res: Response) => {
	try {
		const blogs = await Blogs.find().lean();

		for (let blog of blogs) {
			if (!ViewsCount.findOne({ blogId: new ObjectId(blog._id) })) {
				new ViewsCount({
					blogId: new ObjectId(blog._id),
					counter: 0,
				}).save();
			}
		}

		return res.json("Success");
	} catch (err) {
		console.log("Error", err);
	}
});
 */
// Api
app.use(
	"/api/blogs",
	lazyLoad(() => import("./routes/blog"))
);

app.use(
	"/login",
	lazyLoad(() => import("./routes/login"))
);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log("Server is running on port ", PORT);
});
