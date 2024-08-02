require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const db = require("./config/database");
const logger = require("./logger/logger");
const getResponse = require("./utils/helpers/getResponse");
const cors = require("cors");
const apiRouter = express.Router();
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { PORT } = require("./config/index");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("./utils/constants/constants");

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
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(
      getResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      )
    );
}
db.authenticate()
  .then(() => logger.info(SUCCESS_MESSAGES.DATABASE_CONN))
  .catch((err) => logger.error(ERROR_MESSAGES.DATABASE_ERROR + err));

apiRouter.use("/users", userRoutes);
apiRouter.use("/posts", postRoutes);
apiRouter.use("/comments", commentRoutes);

app.use("/api", apiRouter);

app.listen(PORT, (err, res) => {
  logger.info(SUCCESS_MESSAGES.SERVER + PORT);
});
