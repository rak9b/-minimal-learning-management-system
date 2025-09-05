import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundAPI = (req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API endpoint not found!",
    error: "",
  });
};

export default notFoundAPI;
