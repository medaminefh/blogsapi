import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const viewsCount = new mongoose.Schema({
	blogId: {
		type: ObjectId,
		ref: "Blogs",
		required: true,
		unique: true,
	},
	counter: {
		type: Number,
		required: true,
		default: 0,
	},
});

export default mongoose.model("ViewsCount", viewsCount);
