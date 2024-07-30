const express = require("express");
const userController = require("../controllers/userController");
const userExists = require("../middleware/userAuth");
const validationMiddleware = require("../middleware/validation");
const router = express.Router();
const {
  signUp,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  userLogout,
} = userController;
const {
  userSignupSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
} = require("../utils/validations/userValidation");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/verify-email/:id/:token", verifyEmail);
router.delete("/:id", deleteUser);
router.get("/:id/logout", userLogout);
router.post("/login", validationMiddleware(userLoginSchema), login);
router.put("/:id", validationMiddleware(updateUserSchema), updateUser);
router.post(
  "/signup",
  validationMiddleware(userSignupSchema),
  userExists,
  signUp
);
router.post(
  "/forgot-password",
  validationMiddleware(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/reset-password/:id/:token",
  validationMiddleware(resetPasswordSchema),
  resetPassword
);

module.exports = router;
