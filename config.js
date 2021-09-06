const mongoose = require("mongoose");

const URI = process.env.MONGODB_URL;
module.exports = mongoose.connect(URI, (err) => {
  if (err) {
    console.log(err);
    return err;
  }
  console.log("Connected to MongoDB");
});
