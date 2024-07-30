const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const db = require("./config/database");
const userRoutes = require("./routes/userRoutes"); //ADD USER ROUTES
const { PORT } = require("./config/.localEnv");
const logger = require("./logger/logger");
const getResponse = require("./utils/helpers/responseStructure");
const cors = require("cors");
const DICTIONARY = require("./utils/constants/dictionary");
const { ReasonPhrases } = require("http-status-codes");
db.authenticate()
  .then(() => logger.info("Database connected"))
  .catch((err) => logger.error("Error connecting to database:", err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(xss());

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

app.use("/api/users", userRoutes);

app.listen(PORT, (err, res) => {
  logger.info(`Server is listening on port: ${PORT}`);
});
