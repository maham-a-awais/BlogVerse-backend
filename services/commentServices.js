const logger = require("../logger/logger");
const { ReasonPhrases } = require("http-status-codes");
const { getResponse } = require("../utils/helpers/getResponse");
const { User, post, Comment } = require("../models/index");

const createCommentService = async (userId, postId, body, parentCommentId) => {
  try {
    const findPost = await post.findByPk(postId);
    if (!findPost)
      return getResponse(404, "Post not found!", ReasonPhrases.NOT_FOUND);
    const newComment = await Comment.create({
      userId,
      postId,
      body,
      parentCommentId,
    });
    if (newComment)
      return getResponse(
        201,
        "Successful! Comment created.",
        ReasonPhrases.CREATED,
        newComment
      );
    return getResponse(
      500,
      "Comment could not be created!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error creating comment",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllCommentService = async (postId) => {
  try {
    const comments = await Comment.findAll({ where: { postId } });
    if (comments)
      return getResponse(200, "Comments found!", ReasonPhrases.OK, comments);
    return getResponse(404, "Comments not found!", ReasonPhrases.NOT_FOUND);
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error fetching comment",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { createCommentService, getAllCommentService };
