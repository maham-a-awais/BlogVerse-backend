import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { KEYS } from "../constants/index";
import { config } from "../../config";
import { logger } from "../../logger";

const {
  SECRET_KEY,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  PASSWORD_RESET_EXPIRATION,
  JWT_REMEMBER_EXPIRATION,
} = config;

/**
 * Generates a JSON Web Token based on the given payload and token type.
 *
 * @param {object} payload - The payload to be signed and included in the JWT.
 * @param {string} tokenType - The type of token to generate.
 * @param {boolean} [remember=false] - Whether to generate a remember me token.
 * @returns {string|undefined} The generated JWT, or undefined if an unsupported token type is given.
 */
export const signToken = (
  payload: object,
  tokenType: string,
  remember: boolean = false
): string | undefined => {
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
};

/**
 * Verifies a given JSON Web Token.
 *
 * @param {string} token - The token to verify.
 * @returns {JwtPayload | string | undefined} The decoded payload if the token is valid, or undefined if the token is invalid.
 * @throws {TokenExpiredError} If the token has expired.
 */
export const verifyToken = (token: string): JwtPayload | string | undefined => {
  try {
    logger.info("IN VERIFY TOKEN");
    logger.info(jwt.verify(token, SECRET_KEY));
    return jwt.verify(token, SECRET_KEY);
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      logger.error(error.message);
      throw error;
    }
  }
};
