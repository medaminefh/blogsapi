import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ICustomRequest } from "../utils/types";
const { JWT } = process.env;

export const auth = (
	req: ICustomRequest,
	res: Response,
	next: NextFunction
) => {
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

export const userIsAdmin = (
	req: ICustomRequest,
	_: Response,
	next: NextFunction
) => {
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

export function notFound(
	req: ICustomRequest,
	res: Response,
	next: NextFunction
) {
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	res.status(404).json({ error });
	next(error);
}

/* eslint-disable no-unused-vars */
export function errorHandler(
	err: Error,
	_: Request,
	res: Response,
	next: NextFunction
) {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	return res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
	});
}
