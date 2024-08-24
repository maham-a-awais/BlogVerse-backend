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
// const upload = require("../middleware/multer");
// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", validationMiddleware(userLoginSchema), login);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:id/:token", verifyEmail);
router.post("/", validationMiddleware(userSignupSchema), userExists, signUp);
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

//PROTECTED ROUTES
router.get("/", authenticate, getUserById);
router.get("/logout", authenticate, userLogout);
router.delete("/", authenticate, deleteUser);
router.put(
  "/",
  authenticate,
  validationMiddleware(updateUserSchema),
  // upload.single("avatar"),
  updateUser
);
router.post(
  "/change-password",
  authenticate,
  validationMiddleware(changePasswordSchema),
  changePassword
);

module.exports = router;
