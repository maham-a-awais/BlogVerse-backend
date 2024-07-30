const responseStructure = require("../utils/helpers/responseStructure");
const logger = require("../logger/logger");
const { ReasonPhrases } = require("http-status-codes");
const joi = require("joi");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        logger.error(error.message);
        res
          .status(400)
          .json(
            responseStructure(400, error.message, ReasonPhrases.BAD_REQUEST)
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
