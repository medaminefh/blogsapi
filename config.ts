import mongoose from "mongoose";
const URI = process.env.MONGODB_URL;
/* "mongodb://127.0.0.1:27017/blogsdb"; */

module.exports = mongoose.connect(URI!, (err) => {
	if (err) {
		console.log(err);
		return err;
	}

	console.log("Connected to MongoDB");
	return "Connected to db!";
});
