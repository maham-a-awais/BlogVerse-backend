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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get current user
 *     description: Retrieve the current user's profile
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User profile
 */
router.get("/", authenticate, getUserById);

/**
 * @swagger
 * /users/verify-email/{id}/{token}:
 *   get:
 *     summary: Verify email
 *     description: Verify a user's email address
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.get("/verify-email/:id/:token", verifyEmail);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout
 *     description: Logout the current user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get("/logout", authenticate, userLogout);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete user
 *     description: Delete the current user's account
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete("/", authenticate, deleteUser);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login
 *     description: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/login", validationMiddleware(userLoginSchema), login);
/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh token
 *     description: Refresh the current user's token
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh-token", refreshToken);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update user
 *     description: Update the current user's profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email address
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
  "/",
  authenticate,
  validationMiddleware(updateUserSchema),
  updateUser
);

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Signup
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post(
  "/signup",
  validationMiddleware(userSignupSchema),
  userExists,
  signUp
);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Send a password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 */
router.post(
  "/forgot-password",
  validationMiddleware(forgotPasswordSchema),
  forgotPassword
);

/**
 * @swagger
 * /users/reset-password/{id}/{token}:
 *   post:
 *     summary: Reset password
 *     description: Reset a user's password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post(
  "/reset-password/:id/:token",
  validationMiddleware(resetPasswordSchema),
  resetPassword
);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change password
 *     description: Change a user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post(
  "/change-password",
  authenticate,
  validationMiddleware(changePasswordSchema),
  changePassword
);

module.exports = router;
