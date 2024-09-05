import { verifyToken } from "../utils/helpers/jwtHelper";
import { User } from "../models/index";
import { logger } from "../logger";
import { sendResponse, getResponse } from "../utils/helpers/getResponse";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES, KEYS } from "../utils/constants";
import { Request, Response, NextFunction } from "express";

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

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header(KEYS.AUTHORIZATION);
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
    // const decodedToken = jwt.verify(token, SECRET_KEY);
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
