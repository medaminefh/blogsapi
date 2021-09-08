require("dotenv").config();

const cors = require("cors");
const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", parameterLimit: 100000, extended: true })
);

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

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
