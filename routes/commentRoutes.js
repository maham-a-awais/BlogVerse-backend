const express = require("express");
const validationMiddleware = require("../middleware/validation");
const router = express.Router();
const { authenticate } = require("../middleware/userAuth");
const {
  createCommentSchema,
  updateCommentSchema,
} = require("../utils/validations/commentValidations");
const {
  createComment,
  getAllComments,
  getReplies,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     description: Retrieve all comments for a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Comment not found for this post
 */
router.get("/:postId", getAllComments);

/**
 * @swagger
 * /comments/{postId}/{parentCommentId}:
 *   get:
 *     summary: Get replies for a comment
 *     description: Retrieve replies for a comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: parentCommentId
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
 *       404:
 *         description: Replies not found for this comment
 */
router.get("/:postId/:parentCommentId", getReplies);

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
 * /comments/{postId}/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete("/:postId/:id", authenticate, deleteComment);

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
 * /comments/{postId}:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: comment
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             parentCommentId:
 *               type: integer
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  "/:postId",
  authenticate,
  validationMiddleware(createCommentSchema),
  createComment
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
 * /comments/{postId}/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Update a comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: comment
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             parentCommentId:
 *               type: integer
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid request
 */
router.put(
  "/:postId/:id",
  authenticate,
  validationMiddleware(updateCommentSchema),
  updateComment
);

module.exports = router;
