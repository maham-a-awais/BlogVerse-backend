const {
  createCommentService,
  getAllCommentService,
  getAllRepliesService,
  updateCommentService,
  deleteCommentService,
} = require("../services/commentServices");
const { sendResponse } = require("../utils/helpers/getResponse");

const createComment = async (req, res) => {
  const { postId } = req.params;
  const { body, parentCommentId } = req.body;
  const userId = req.user.id;
  const response = await createCommentService(
    userId,
    postId,
    body,
    parentCommentId
  );
  return sendResponse(res, response);
};

const getAllComments = async (req, res) => {
  const postId = req.params.postId;
  const response = await getAllCommentService(postId, req.query);
  return sendResponse(res, response);
};

const getReplies = async (req, res) => {
  const { postId, parentCommentId } = req.params;
  const response = await getAllRepliesService(
    postId,
    parentCommentId,
    req.query
  );
  return sendResponse(res, response);
};

const updateComment = async (req, res) => {
  const userId = req.user.id;
  const { postId, id } = req.params;
  const { body } = req.body;
  const response = await updateCommentService(userId, postId, id, body);
  return sendResponse(res, response);
};

const deleteComment = async (req, res) => {
  const userId = req.user.id;
  const { postId, id } = req.params;
  const response = await deleteCommentService(userId, postId, id);
  return sendResponse(res, response);
};
module.exports = {
  createComment,
  getAllComments,
  getReplies,
  updateComment,
  deleteComment,
};
