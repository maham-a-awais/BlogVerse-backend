const { User } = require("../models/index");
const logger = require("../logger/logger");
const jwt = require("jsonwebtoken");
const { getResponse } = require("../utils/helpers/getResponse");
const { ReasonPhrases } = require("http-status-codes");

const { SECRET_KEY } = require("../config/localEnv");

const userExists = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return res
        .status(409)
        .json(getResponse(409, "Email already exists", ReasonPhrases.CONFLICT));
    }
    next();
  } catch (error) {
    logger.error(`Middleware: ${error}`);
    return res
      .status(500)
      .json(
        getResponse(
          500,
          "Error Signing up",
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json(
          getResponse(401, "Unauthorized User!", ReasonPhrases.UNAUTHORIZED)
        );
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json(
        getResponse(
          500,
          "Error authenticating user!",
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
  }
};

module.exports = { userExists, authenticate };
