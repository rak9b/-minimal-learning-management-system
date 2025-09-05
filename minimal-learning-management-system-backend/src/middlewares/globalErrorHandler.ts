import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../config";
import { IGenericErrorMessage } from "../interface/error";
import handleValidationError from "../error/validaitonError";
import { ZodError } from "zod";
import handleZodError from "../error/zodError";
import handleCastError from "../error/castError";
import ApiError from "../error/apiError";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === "development"
    ? console.log(`Error in global error handler:`, { error })
    : console.log(`Error in global error handler:`, error);

  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [];

  const setErrorResponse = (
    status: number,
    msg: string,
    details?: IGenericErrorMessage[]
  ) => {
    statusCode = status;
    message = msg;
    errorMessages = details || [{ path: "", message: msg }];
  };
  if (error?.name === "ValidationError") {
    const { statusCode, message, errorMessages } = handleValidationError(error);
    setErrorResponse(statusCode, message, errorMessages);
  } else if (error instanceof ZodError) {
    const { statusCode, message, errorMessages } = handleZodError(error);
    setErrorResponse(statusCode, message, errorMessages);
  } else if (error?.name === "CastError") {
    const { statusCode, message, errorMessages } = handleCastError(error);
    setErrorResponse(statusCode, message, errorMessages);
  } else if (error instanceof ApiError) {
    setErrorResponse(error?.statusCode, error.message);
  } else if (error instanceof Error) {
    setErrorResponse(500, error.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
