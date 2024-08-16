const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};
const errorHandler = (err, req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      )
    );
};

module.exports = { logErrors, errorHandler };
