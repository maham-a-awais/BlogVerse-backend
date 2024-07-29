const responseStructure = (statusCode, message, response) => {
  return {
    statusCode,
    message,
    response,
  };
};

module.exports = responseStructure;
