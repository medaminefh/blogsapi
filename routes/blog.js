const router = require("express").Router();

const Blogs = require("../models/blog");

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

module.exports = router;
