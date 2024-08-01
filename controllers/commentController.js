const {
  createCommentService,
  getAllCommentService,
} = require("../services/commentServices");

const createComment = async (req, res) => {
  const { postId, body, parentCommentId } = req.body;
  const userId = req.user.id;
  const response = await createCommentService(
    userId,
    postId,
    body,
    parentCommentId
  );
  return res.status(response.statusCode).json(response);
};

const getAllComments = async (req, res) => {
  const postId = req.params.postId;
  const response = await getAllCommentService(postId);
  return res.status(response.statusCode).json(response);
};

const getReplies = async (req, res) => {
  const { postId, parentCommentId } = req.params;
  const response = await getAllRepliesService(postId);
  return res.status(response.statusCode).json(response);
};
module.exports = { createComment, getAllComments };
