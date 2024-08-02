const logger = require("../logger/logger");
const { getResponse } = require("../utils/helpers/getResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        logger.error(error.message);
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            getResponse(
              StatusCodes.BAD_REQUEST,
              error.message,
              ReasonPhrases.BAD_REQUEST
            )
          );
      } else {
        next();
      }
    } catch (error) {
      logger.error(error.message);
    }
  };
};

module.exports = validationMiddleware;
