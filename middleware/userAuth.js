const express = require("express");
const { User } = require("../models/index");
const logger = require("../logger/logger");
const responseStructure = require("../utils/helpers/responseStructure");
const { error } = require("winston");
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
        .json(responseStructure(409, "Email already exists"));
    }
    next();
  } catch (error) {
    logger.error(`Middleware: ${error}`);
  }
};

module.exports = userExists;
