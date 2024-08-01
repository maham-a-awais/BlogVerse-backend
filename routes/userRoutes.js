const express = require("express");
const { userExists, authenticate } = require("../middleware/userAuth");
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

router.get("/", getAllUsers);
router.get("/:id", authenticate, getUserById);
router.get("/verify-email/:id/:token", verifyEmail);
router.delete("/:id", authenticate, deleteUser);
router.get("/:id/logout", authenticate, userLogout);
router.post("/login", validationMiddleware(userLoginSchema), login);
router.put(
  "/:id",
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

router.post("/refresh-token", refreshToken);
router.post(
  "/change-password",
  validationMiddleware(changePasswordSchema),
  authenticate,
  changePassword
);

module.exports = router;
