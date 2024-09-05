import dotenv from "dotenv";
import express, { Request, Response, NextFunction, Router } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./logger/index";
// import swagger from "./swagger";
import { router } from "./routes/index";
import { config } from "./config/index";
import { SUCCESS_MESSAGES } from "./utils/constants";
// import { sequelize } from "./models";
// import { logErrors, errorHandler } from "./middleware/errorHandlers";
// import { SUCCESS_MESSAGES } from "./utils/constants/constants";

dotenv.config();
const { PORT } = config;
const app = express();
const apiRouter = Router();

// MIDDLEWARES
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 3600, // 1 hour
  })
);
app.use(cookieParser());
app.use(helmet());

// app.use(logErrors as (err: Error, req: Request, res: Response, next: NextFunction) => void);
// app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

// SYNCHING SEQUELIZE WITH DATABASE
// const syncSequelize = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     logger.info("Sequelize successful");
//   } catch (error) {
//     logger.error(`Error with syncing sequelize: ${error}`);
//   }
// };

app.use("/api/v1", router);

// swagger(app);

const port = PORT || 4000;
app.listen(port, async (err?: Error) => {
  if (err) {
    logger.error(err);
  } else {
    logger.info(`${SUCCESS_MESSAGES.SERVER} ${port}`);
    // await syncSequelize();
  }
});
