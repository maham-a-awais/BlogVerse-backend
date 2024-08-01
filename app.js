const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const db = require("./config/database");
const logger = require("./logger/logger");
const getResponse = require("./utils/helpers/getResponse");
const cors = require("cors");
const { ReasonPhrases } = require("http-status-codes");
const { PORT } = require("./config/index");
const userRoutes = require("./routes/userRoutes"); //ADD USER ROUTES
const postRoutes = require("./routes/postRoutes"); //ADD POST ROUTES
const commentRoutes = require("./routes/commentRoutes"); //ADD POST ROUTES
const apiRouter = express.Router();
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(cookieParser());
app.use(helmet());

app.use(logErrors);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function errorHandler(err, req, res, next) {
  res
    .status(500)
    .send(getResponse(500, "Error!", ReasonPhrases.INTERNAL_SERVER_ERROR));
}
db.authenticate()
  .then(() => logger.info("Database connected"))
  .catch((err) => logger.error("Error connecting to database:", err));

apiRouter.use("/users", userRoutes);
apiRouter.use("/posts", postRoutes);
apiRouter.use("/comments", commentRoutes);

app.use("/api", apiRouter);

app.listen(PORT, (err, res) => {
  logger.info(`Server is listening on port: ${PORT}`);
});
