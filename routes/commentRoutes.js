const express = require("express");
const validationMiddleware = require("../middleware/validation");
const router = express.Router();
const { authenticate } = require("../middleware/userAuth");
const {
  createComment,
  getAllComments,
} = require("../controllers/commentController");

router.post("/", authenticate, createComment);
router.get("/:postId", getAllComments);

module.exports = router;
