const { sendResponse } = require("../utils/helpers/getResponse");
const {
  createPostService,
  getAllPostService,
  getMyPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} = require("../services/postServices");

const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, body, minTimeToRead, categoryId, image } = req.body;

  const response = await createPostService(
    userId,
    title,
    body,
    minTimeToRead,
    categoryId,
    image
  );
  return sendResponse(res, response);
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { title, body, minTimeToRead, categoryId, image } = req.body;
  const response = await updatePostService(
    userId,
    postId,
    title,
    body,
    minTimeToRead,
    categoryId,
    image
  );
  return sendResponse(res, response);
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const response = await deletePostService(userId, postId);
  return sendResponse(res, response);
};

const getMyPosts = async (req, res) => {
  const { id: userId } = req.user;
  const response = await getMyPostService(userId, req.query, 10, 0);
  return res.status(response.statusCode).json(response);
};

const getAllPosts = async (req, res) => {
  const response = await getAllPostService(req.query, 10, 0);
  return res.status(response.statusCode).json(response);
};

const getPostById = async (req, res) => {
  const response = await getPostByIdService(req.params);
  return res.status(response.statusCode).json(response);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getAllPosts,
  getPostById,
};
