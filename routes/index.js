// routes/index.js
const express = require("express");
const apiRouter = express.Router();
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");

apiRouter.use("/users", userRoutes);
apiRouter.use("/posts", postRoutes);
apiRouter.use("/comments", commentRoutes);

module.exports = apiRouter;
