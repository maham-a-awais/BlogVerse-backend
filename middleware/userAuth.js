const { User } = require("../models/index");
const logger = require("../logger/logger");
const getResponse = require("../utils/helpers/responseStructure");
const { ReasonPhrases } = require("http-status-codes");

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
  }
};

module.exports = userExists;
