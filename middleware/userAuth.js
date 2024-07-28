const express = require("express");
const { User } = require("../models/index");

const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (username) {
      return res.status(409).json({ message: "Email already exists" });
    }
    next();
  } catch (error) {
    console.log(`Middleware: ${error}`);
  }
};

module.exports = saveUser;
