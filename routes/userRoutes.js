const express = require("express");
const validationMiddleware = require("../middleware/validation");
const router = express.Router();
const { userExists, authenticate } = require("../middleware/userAuth");
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
  refreshToken,
  changePassword,
} = require("../controllers/userController");
const {
  userSignupSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  changePasswordSchema,
} = require("../utils/validations/userValidation");

// router.get("/", getAllUsers);
router.get("/", authenticate, getUserById);
router.get("/verify-email/:id/:token", verifyEmail);
router.get("/logout", authenticate, userLogout);
router.delete("/", authenticate, deleteUser);
router.post("/login", validationMiddleware(userLoginSchema), login);
router.post("/refresh-token", refreshToken);
router.put(
  "/",
  validationMiddleware(updateUserSchema),
  authenticate,
  updateUser
);
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
router.post(
  "/change-password",
  authenticate,
  validationMiddleware(changePasswordSchema),
  changePassword
);

module.exports = router;
