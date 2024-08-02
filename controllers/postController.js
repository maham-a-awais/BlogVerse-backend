const { sendResponse } = require("../utils/helpers/getResponse");
const {
  createPostService,
  getAllPostService,
  getMyPostService,
  updatePostService,
  deletePostService,
  searchPostService,
  searchMyPostService,
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

const getAllPosts = async (req, res) => {
  const response = await getAllPostService();
  return sendResponse(res, response);
};

const getMyPosts = async (req, res) => {
  const userId = req.user.id;
  const response = await getMyPostService(userId);
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

const searchPosts = async (req, res) => {
  const { categoryId, title } = req.query;
  const response = await searchPostService(categoryId, title);
  return sendResponse(res, response);
};

const searchMyPosts = async (req, res) => {
  const userId = req.user.id;
  const { categoryId, title } = req.query;
  const response = await searchMyPostService(userId, categoryId, title);
  return sendResponse(res, response);
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
