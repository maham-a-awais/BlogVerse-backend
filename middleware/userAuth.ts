import { verifyToken } from "../utils/helpers/jwtHelper";
import { User } from "../models/user";
import { logger } from "../logger";
import { sendResponse, getResponse } from "../utils/helpers/getResponse";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES, KEYS } from "../utils/constants";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: JwtPayload | string;
}

/**
 * Checks if a user with the same email already exists
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @throws {Error} - Internal Server Error
 * @returns Response - A response object with a HTTP status code and a JSON body
 */
export const userExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return sendResponse(
        res,
        getResponse(
          StatusCodes.CONFLICT,
          ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS,
          ReasonPhrases.CONFLICT
        )
      );
    }
    next();
  } catch (error) {
    logger.error(error);
    return sendResponse(
      res,
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.USER.SIGN_UP,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      )
    );
  }
};

/**
 * Verifies the authorization token sent in the Authorization header.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @throws {Error} - Internal Server Error
 * @returns Response - A response object with a HTTP status code and a JSON body
 */
export const authenticate = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    console.log("IN AUTHENTICATE");
    logger.info("IN AUTHENTICATE");

    const authHeader = req.header(KEYS.AUTHORIZATION);

    logger.info("AUTH HEADER IS", authHeader);
    if (!authHeader) {
      return sendResponse(
        res,
        getResponse(
          StatusCodes.UNAUTHORIZED,
          ERROR_MESSAGES.USER.UNAUTHORIZED,
          ReasonPhrases.UNAUTHORIZED
        )
      );
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error(error);
    return sendResponse(
      res,
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.USER.AUTHORIZATION_FAILED,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      )
    );
  }
};
