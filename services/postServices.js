const { User, post, category } = require("../models/index");
const logger = require("../logger/logger");
const { getResponse } = require("../utils/helpers/getResponse");
const { ReasonPhrases } = require("http-status-codes");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const createPostService = async (
  userId,
  title,
  body,
  minTimeToRead,
  categoryId,
  image
) => {
  try {
    logger.info(userId);
    // const user = await User.findByPk(id);
    const user = await User.findByPk(userId);
    logger.info("User:", user);
    if (user) {
      //   logger.info("User found with id:", user.id);
      const categoryExists = await category.findOne({
        where: {
          id: categoryId,
        },
      });
      if (categoryExists) {
        logger.info("In category exists");
        logger.info(userId);
        const newPost = await post.create({
          userId: userId,
          categoryId,
          title,
          body,
          minTimeToRead,
          image,
        });
        return getResponse(
          201,
          "Post Published!",
          ReasonPhrases.CREATED,
          newPost
        );
      } else {
        return getResponse(404, "Invalid Category", ReasonPhrases.NOT_FOUND);
      }
    } else {
      return getResponse(404, "User doesn't exist", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(500, "Error publishing post", ReasonPhrases.NOT_FOUND);
  }
};

const getAllPostService = async () => {
  try {
    const posts = await post.findAll({
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (newest first)
    });
    if (posts) {
      return getResponse(
        200,
        "Posts retrieved successfully",
        ReasonPhrases.OK,
        posts
      );
    } else {
      return getResponse(404, "Could not find posts!", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error fetching posts",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getMyPostService = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const posts = await post.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      return getResponse(
        200,
        "Posts retrieved successfully",
        ReasonPhrases.OK,
        posts
      );
    } else {
      return getResponse(404, "Could not find posts!", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      `Error fetching ${user.fullName}'s posts`,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const updatePostService = async (
  userId,
  postId,
  title,
  body,
  minTimeToRead,
  categoryId,
  image
) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const updatePost = post.update(
        {
          title,
          body,
          minTimeToRead,
          categoryId,
          image,
        },
        { where: { id: postId } }
      );
      if (updatePost)
        return getResponse(200, "Post updated!", ReasonPhrases.OK);
      else
        return getResponse(
          500,
          "Post couldn't be updated!",
          ReasonPhrases.INTERNAL_SERVER_ERROR
        );
    } else {
      return getResponse(404, "User doesn't exist!", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      `Error updating post`,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const deletePostService = async (userId, postId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const findPost = await post.findByPk(postId);
      if (!findPost)
        return getResponse(404, "Post doesn't exist!", ReasonPhrases.NOT_FOUND);
      await post.destroy({ where: { id: postId } });
      return getResponse(200, "Post Deleted Successfully!", ReasonPhrases.OK);
    } else {
      return getResponse(404, "User doesn't exist!", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      `Error deleting post`,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const searchPostService = async (categoryId, title) => {
  try {
    if (!categoryId && !title)
      return getResponse(200, "Search by title or category", ReasonPhrases.OK);
    const findItems = {
      ...(title && { title: { [Op.iLike]: `%${title}%` } }),
      ...(categoryId && { categoryId }),
    };

    const posts = await post.findAll({
      where: {
        [Op.or]: findItems,
      },
    });
    if (posts) {
      return getResponse(
        200,
        "Posts retrieved successfully",
        ReasonPhrases.OK,
        posts
      );
    }
    return getResponse(404, "No posts found", ReasonPhrases.NOT_FOUND);
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      `Error searching for post`,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const searchMyPostService = async (userId, categoryId, title) => {
  const getPosts = await searchPostService(categoryId, title);
  if (getPosts.data) {
    const myPosts = getPosts.data.filter((post) => post.userId === userId);
    if (myPosts.length > 0) {
      return getResponse(
        200,
        "Posts retrieved successfully",
        ReasonPhrases.OK,
        myPosts
      );
    } else return getResponse(404, "No posts found", ReasonPhrases.NOT_FOUND);
  } else return getResponse(404, "No posts found", ReasonPhrases.NOT_FOUND);
};

module.exports = {
  createPostService,
  getAllPostService,
  getMyPostService,
  updatePostService,
  deletePostService,
  searchPostService,
  searchMyPostService,
};
