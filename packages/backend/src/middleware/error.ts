import { AuthError } from "@/errors/auth";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ValidateError } from "@tsoa/runtime";
import { logger } from "@/utils/logging";
interface IError {
  status?: number;
  fields?: string[];
  message?: string;
  name?: string;
}

const ENV = process.env.NODE_ENV;

const getErrorBody = (err: unknown) => {
  if (err instanceof ValidateError) {
    return {
      message: err.message,
      status: StatusCodes.BAD_REQUEST,
      fields: err.fields,
      name: err.name,
    };
  } else if (err instanceof AuthError) {
    return {
      message: err.message,
      status: StatusCodes.UNAUTHORIZED,
    };
  } else {
    return {
      message: "UNKNOWN_ERROR",
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

export const errorHandler = (
  err: IError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (ENV !== "production") {
    logger.error(err);
  }

  const body = getErrorBody(err);
  res.status(body.status).json(body);
  next();
};
