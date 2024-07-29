const express = require("express");
const userController = require("../controllers/userController");
const { signUp, login, verifyEmail, forgotPassword, resetPassword } =
  userController;
const userExists = require("../middleware/userAuth");

const router = express.Router();

router.post("/signup", userExists, signUp);
router.post("/login", login);
router.get("/verify-email/:id/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;
