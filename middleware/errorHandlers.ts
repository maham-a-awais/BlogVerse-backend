import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES } from "../utils/constants";
import { Request, Response, NextFunction } from "express";
import { getResponse } from "../utils/helpers/getResponse";

export const logErrors = (err: Error, next: NextFunction) => {
  console.error(err.stack);
  next(err);
};

export const errorHandler = (res: Response): Response => {
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      )
    );
};
