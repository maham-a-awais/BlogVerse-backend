require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const logger = require("./logger/logger");
const cors = require("cors");
const swagger = require("./swagger");
const apiRouter = require("./routes/index");
const { PORT } = require("./config/index");
const { sequelize } = require("./models");
const { logErrors, errorHandler } = require("./middleware/errorHandlers");
const { SUCCESS_MESSAGES } = require("./utils/constants/constants");

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(helmet());

app.use(logErrors);
app.use(errorHandler);

//SYNCHING SEQUELIZE WITH DATABASE
const syncSequelize = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info("Sequelize successful");
  } catch (error) {
    logger.error(`Error with syncing sequelize: ${error}`);
  }
};

app.use("/api", apiRouter);

swagger(app);

const port = PORT || 3000;
app.listen(port, async (err, res) => {
  logger.info(SUCCESS_MESSAGES.SERVER + port);
  await syncSequelize();
});
