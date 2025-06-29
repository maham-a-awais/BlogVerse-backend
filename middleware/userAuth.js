const jwt = require("jsonwebtoken");
const logger = require("../logger/logger");
const { User } = require("../models/index");
const { getResponse, sendResponse } = require("../utils/helpers/getResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { ERROR_MESSAGES } = require("../utils/constants/constants");
const { SECRET_KEY } = require("../config");

const userExists = async (req, res, next) => {
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

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
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
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error(error.message);
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

module.exports = { userExists, authenticate };
