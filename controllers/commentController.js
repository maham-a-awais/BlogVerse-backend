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
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

const getAllComments = async (req, res) => {
  const postId = req.params.postId;
  const response = await getAllCommentService(postId);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

const getReplies = async (req, res) => {
  const { postId, parentCommentId } = req.params;
  const response = await getAllRepliesService(postId, parentCommentId);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

const updateComment = async (req, res) => {
  const userId = req.user.id;
  const { postId, id } = req.params;
  const { body } = req.body;
  const response = await updateCommentService(userId, postId, id, body);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

const deleteComment = async (req, res) => {
  const userId = req.user.id;
  const { postId, id } = req.params;
  const response = await deleteCommentService(userId, postId, id);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};
module.exports = {
  createComment,
  getAllComments,
  getReplies,
  updateComment,
  deleteComment,
};
