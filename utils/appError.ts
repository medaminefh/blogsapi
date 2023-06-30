import { Response } from "express";
import { AppErrorArgs, HttpCode } from "./types";

export class AppError extends Error {
	public readonly name: string;
	public readonly httpCode: HttpCode;
	public readonly isOperational: boolean = true;

	constructor(args: AppErrorArgs) {
		super(args.description);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = args.name || "Error";
		this.httpCode = args.httpCode;

		if (args.isOperational !== undefined) {
			this.isOperational = args.isOperational;
		}

		Error.captureStackTrace(this);
	}
}
