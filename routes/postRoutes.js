const express = require("express");
const validationMiddleware = require("../middleware/validation");
const router = express.Router();
const { authenticate } = require("../middleware/userAuth");
const {
  createPostSchema,
  updatePostSchema,
} = require("../utils/validations/postValidation");
const {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users
 *   - name: Posts
 *     description: Operations related to posts
 *   - name: Comments
 *     description: Operations related to comments
 */
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/", getAllPosts);

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
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Posts
 *     responses:
 *       204:
 *         description: Post deleted successfully
 */
router.delete("/:postId", authenticate, deletePost);

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
 * /posts/my-posts:
 *   get:
 *     summary: Get my posts
 *     description: Retrieve a list of posts created by the current user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/my-posts", authenticate, getMyPosts);

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
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The post title
 *               content:
 *                 type: string
 *                 description: The post content
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Posts
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post(
  "/",
  authenticate,
  validationMiddleware(createPostSchema),
  createPost
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
 * /posts/{postId}:
 *   put:
 *     summary: Update a post
 *     description: Update a post by ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The post title
 *               content:
 *                 type: string
 *                 description: The post content
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put(
  "/:postId",
  authenticate,
  validationMiddleware(updatePostSchema),
  updatePost
);

module.exports = router;
