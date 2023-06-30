import { Request } from "express";

export interface ICustomRequest extends Request {
	isAuthorized: boolean; // or any other type
}

export enum HttpCode {
	OK = 200,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
}

export interface AppErrorArgs {
	name?: string;
	httpCode: HttpCode;
	description: string;
	isOperational?: boolean;
}
