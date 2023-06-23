import mongoose from "mongoose";

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
		img_url: { type: String, default: "" },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Blogs", blogSchema);
