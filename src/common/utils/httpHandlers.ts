import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const validateRequest = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.parseAsync({ body: req.body, query: req.query, params: req.params });

		next();
	} catch (err) {
		const errors = (err as ZodError).errors.map((e) => ({
			field: e.path.length > 0 ? e.path?.[e.path.length - 1].toString() : "root",
			message: e.message
		}));
		const errorMessage = errors.length === 1 ? `Invalid Input: ${errors.map(e => e?.message).join(",")}` : ''

		const statusCode = StatusCodes.BAD_REQUEST;
		const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode, errors);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	}
};
