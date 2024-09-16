import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES } from "../utils/constants";
import { Request, Response, NextFunction } from "express";
import { getResponse } from "../utils/helpers/getResponse";

/**
 * Logs any error that is passed to it to the console using console.error and
 * then calls next with the error as an argument.
 *
 * @param err - The error to log and pass to next.
 * @param req - The Request object.
 * @param res - The Response object.
 * @param next - The NextFunction to call with the error.
 */
export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  next(err);
};

/**
 * This middleware is a catch-all for any unhandled errors that reach the Express.js
 * error handling middleware stack. It will send a response with a 500 status code
 * and a JSON object containing the error message.
 *
 * @param res - The Response object.
 * @returns The Response object after sending the error response.
 */
export const errorHandler = (res: Response): Response => {
  return res.send(
    getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    )
  );
};
