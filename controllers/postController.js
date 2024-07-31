const {
  createPostService,
  getAllPostService,
  getMyPostService,
  updatePostService,
  deletePostService,
  searchPostService,
  searchMyPostService,
} = require("../services/postServices");
const logger = require("../logger/logger");

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
  return res.status(response.statusCode).json(response);
};

const getAllPosts = async (req, res) => {
  const response = await getAllPostService();
  return res.status(response.statusCode).json(response);
};

const getMyPosts = async (req, res) => {
  const userId = req.user.id;
  const response = await getMyPostService(userId);
  return res.status(response.statusCode).json(response);
};

const updatePost = async (req, res) => {
  const postId = req.params.postId;
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
  return res.status(response.statusCode).json(response);
};

const deletePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const response = await deletePostService(userId, postId);
  return res.status(response.statusCode).json(response);
};

const searchPosts = async (req, res) => {
  const { categoryId, title } = req.query;
  const response = await searchPostService(categoryId, title);
  return res.status(response.statusCode).json(response);
};

const searchMyPosts = async (req, res) => {
  const userId = req.user.id;
  const { categoryId, title } = req.query;
  const response = await searchMyPostService(userId, categoryId, title);
  return res.status(response.statusCode).json(response);
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
  searchPosts,
  searchMyPosts,
};
