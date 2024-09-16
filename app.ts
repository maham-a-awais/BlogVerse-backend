import { config as dotenvConfig } from "dotenv";
import express, { Request, Response, NextFunction, Router } from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import { logger } from "./logger/index";
import bodyParser from "body-parser";
// import { swaggerDocs } from "./swagger";
import { router } from "./routes/index";
import { config } from "./config/index";
import { SUCCESS_MESSAGES } from "./utils/constants";
import { logErrors } from "./middleware/errorHandlers";
import { sequelizeConnection } from "./config/database";

dotenvConfig();
const { PORT } = config;
const app = express();
// const apiRouter = Router();

// MIDDLEWARES
app.use(bodyParser.json());
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const corsOptions: CorsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600, // 1 hour
};
app.use(cors(corsOptions));

app.use(helmet());

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>
  logErrors(err, req, res, next)
);
// app.use(errorHandler);

// SYNCHING SEQUELIZE WITH DATABASE
const syncSequelize = async () => {
  try {
    await sequelizeConnection.authenticate();
    await sequelizeConnection.sync();

    logger.info("Sequelize successful");
  } catch (error) {
    logger.error(`Error with syncing sequelize: ${error}`);
  }
};

app.use("/api/v1", router);

// console.log(swaggerDocs);
// logger.info(swaggerDocs);
// swaggerDocs(app);

const port = PORT || 3000;
app.listen(port, async (err?: Error) => {
  if (err) {
    logger.error(err);
  } else {
    logger.info(`${SUCCESS_MESSAGES.SERVER}${port}`);
    await syncSequelize();
  }
});
