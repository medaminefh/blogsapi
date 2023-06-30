import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import Admin from "../models/admin";

const { JWT } = process.env;
const router = express.Router();
// Create admin or Signin admin
router.post("/", async (req: Request, res: Response) => {
	try {
		const { token: Token } = req.body;
		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: Token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const { name, email }: Pick<TokenPayload, "name" | "email"> =
			ticket.getPayload()!;
		const admin = await Admin.find();

		//login
		if (admin.length !== 1) return res.status(400).json({ err: "No Admin" });
		const { username: adminUsername, email: adminEmail } = admin[0];

		if (name !== adminUsername || email !== adminEmail) {
			/* 		throw new AppError({
			description:"You're Not Supposed to be Here 😟, Get The Fuck Out Of Here",
			httpCode: HttpCode.BAD_REQUEST
		}) */
			return res.status(400).json({
				msg: "You're Not Supposed to be Here 😟, Get The Fuck Out Of Here",
			});
		}
		const token = jwt.sign(
			{
				admin: admin[0],
			},
			JWT!
		);
		res.cookie("token", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
		return res.json({ msg: "Login success! 🤩", token });
	} catch (err) {
		return res.status(500).json(err);
	}
});

export default router;
