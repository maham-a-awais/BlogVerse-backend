const { response } = require("express");

const responseStructure = (statusCode, message, response, data) => {
  const result = {
    statusCode,
    message,
    response,
  };
  if (data) result.data = data;
  return result;
};

module.exports = responseStructure;
