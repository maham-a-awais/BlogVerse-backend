const express = require("express");
const userController = require("../controllers/userController");
const { signUp, login, verifyEmail } = userController;
const saveUser = require("../middleware/userAuth");

const router = express.Router();

//signup endpoint
//passing the middlieware function to the signup
router.post("/signup", saveUser, signUp);

//login route
router.post("/login", login);

//email verification route
router.get("/verify-email/:id/:token", verifyEmail);

module.exports = router;
