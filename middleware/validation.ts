import { Schema } from "joi";
import { logger } from "../logger";
import { getResponse, sendResponse } from "../utils/helpers/getResponse";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

/**
 * This middleware validates the request body using the given Joi schema.
 * If the request body is invalid, it sends a 400 response with the error message.
 * If the request body is valid, it calls the next middleware.
 * If an error occurs, it sends a 500 response with the error message.
 * @param schema - The Joi schema used for validation
 * @returns A middleware function that validates the request body
 */
export const validationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        logger.error(error.message);
        sendResponse(
          res,
          getResponse(StatusCodes.BAD_REQUEST, error.message, ReasonPhrases.BAD_REQUEST)
        );
      } else {
        next();
      }
    } catch (error) {
      logger.error(error);
      return sendResponse(
        res,
        getResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error as string,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
    }
  };
};
