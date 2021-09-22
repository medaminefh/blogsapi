const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    categories: [
      {
        type: String,
      },
    ],
    short: {
      type: String,
      required: true,
    },
    long: {
      type: String,
      required: true,
    },
    private: {
      type: String,
      default: false,
    },
    likes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blogs", blogSchema);
