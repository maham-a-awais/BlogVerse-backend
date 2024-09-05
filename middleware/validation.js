const logger = require("../logger");
const { getResponse, sendResponse } = require("../utils/helpers/getResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        logger.error(error.message);
        sendResponse(
          res,
          getResponse(StatusCodes.BAD_REQUEST, error.message, ReasonPhrases.BAD_REQUEST)
        );
        // res
        //   .status(StatusCodes.BAD_REQUEST)
        //   .json(
        //     getResponse(
        //       StatusCodes.BAD_REQUEST,
        //       error.message,
        //       ReasonPhrases.BAD_REQUEST
        //     )
        //   );
      } else {
        next();
      }
    } catch (error) {
      logger.error(error.message);
      return sendResponse(
        res,
        getResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.message,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
    }
  };
};

module.exports = validationMiddleware;
