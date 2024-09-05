import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { config } from "../../config";
import { logger } from "../../logger";
import { ERROR_MESSAGES } from "../constants/index";
import { KEYS } from "../constants/index";
import { getResponse } from "./getResponse";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const {
  SECRET_KEY,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  PASSWORD_RESET_EXPIRATION,
  JWT_REMEMBER_EXPIRATION,
} = config;

export const signAccessToken = (
  payload: object,
  tokenType: string,
  remember: boolean = false
): string | CustomResponse => {
  try {
    switch (tokenType) {
      case KEYS.ACCESS_TOKEN:
        const expiryTime = remember ? JWT_REMEMBER_EXPIRATION : JWT_EXPIRATION;
        return jwt.sign(payload, SECRET_KEY, {
          expiresIn: expiryTime,
        });

      case KEYS.REFRESH_TOKEN:
        return jwt.sign(payload, SECRET_KEY, {
          expiresIn: JWT_REFRESH_EXPIRATION,
        });

      case KEYS.PASSWORD_RESET:
        return jwt.sign(payload, SECRET_KEY, {
          expiresIn: PASSWORD_RESET_EXPIRATION,
        });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.TOKEN.SIGN,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

export const verifyToken = (token: string): JwtPayload | string => {
  try {
    logger.info(jwt.verify(token, SECRET_KEY));
    return jwt.verify(token, SECRET_KEY);
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) logger.error(error.message);
  }
  return ERROR_MESSAGES.TOKEN.VERIFY;
};
