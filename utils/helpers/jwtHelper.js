const jwt = require("jsonwebtoken");
const {
  SECRET_KEY,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  PASSWORD_RESET_EXPIRATION,
  JWT_REMEMBER_EXPIRATION,
} = require("../../config");
const { getResponse } = require("./getResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const logger = require("../../logger/logger");
const { ERROR_MESSAGES } = require("../constants/constants");

module.exports = {
  signAccessToken: (payload, remember = false) => {
    try {
      return jwt.sign(payload, SECRET_KEY, {
        expiresIn: remember ? JWT_REMEMBER_EXPIRATION : JWT_EXPIRATION,
      });
    } catch (error) {
      logger.error(error.message);
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.TOKEN.SIGN,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      );
    }
  },

  signRefreshToken: (payload) => {
    try {
      return jwt.sign(payload, SECRET_KEY, {
        expiresIn: JWT_REFRESH_EXPIRATION,
      });
    } catch (error) {
      logger.error(error.message);
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.TOKEN.SIGN,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      );
    }
  },

  signPasswordResetToken: (payload) => {
    try {
      return jwt.sign(payload, SECRET_KEY, {
        expiresIn: PASSWORD_RESET_EXPIRATION,
      });
    } catch (error) {
      logger.error(error.message);
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.TOKEN.SIGN,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      );
    }
  },

  verifyToken: (token) => {
    try {
      logger.info(jwt.verify(token, SECRET_KEY));
      return jwt.verify(token, SECRET_KEY, (err, res) => {
        if (err) {
          logger.error(err.message);
          return null;
        }
        return res;
      });
    } catch (error) {
      logger.error(error.message);
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.TOKEN.VERIFY,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      );
    }
  },
};
