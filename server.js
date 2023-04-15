require("dotenv").config();

const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const PORT = process.env.PORT || 5000;
const express = require("express");
const { errorHandler, notFound } = require("./middleware/auth");
const { ObjectId } = require("mongoose").mongo;
const Blogs = require("./models/blog");
const ViewsCount = require("./models/views");
const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// connect db
require("./config.js");

// Home route
app.get("/", (req, res) => {
  res.send("<h2>Hello World 🎉</h2>");
});

// Api
app.use("/api/blogs", require("./routes/blog"));

app.use("/login", require("./routes/login"));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
