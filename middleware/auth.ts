import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const { JWT } = process.env;

export const auth = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header("Authorization");
		if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

		jwt.verify(token, JWT!, (err, _) => {
			if (err) {
				return res.status(400).json({ msg: "Invalid Authentication." });
			}

			req.isAuthorized = true;
			next();
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

export const userIsAdmin = (req: Request, _, next: NextFunction) => {
	try {
		const token = req.header("Authorization");
		if (!token) {
			req.isAuthorized = false;
			next();
			return;
		}

		jwt.verify(token, JWT!, (err, _) => {
			if (err) {
				req.isAuthorized = false;
				next();
				return;
			}

			req.isAuthorized = true;
			next();
		});
	} catch (err) {
		return (req.isAuthorized = false);
	}
};

export function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	next(error);
}

/* eslint-disable no-unused-vars */
export function errorHandler(
	err,
	_: Request,
	res: Response,
	next: NextFunction
) {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
	});
}
