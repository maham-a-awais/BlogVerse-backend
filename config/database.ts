// import { logger } from "../logger";
// import dotenv from "dotenv";
// import { config } from ".";
// const { HOST, PASSWORD, USERNAME, DATABASE, DIALECT } = config;
// import { Sequelize } from "sequelize";
// import { Pool } from "pg";
// dotenv.config();

// if (process.env.ENV === "development") {
//   const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL,
//   });
//   const db = new Sequelize(DATABASE, USERNAME, PASSWORD, {
//     host: HOST,
//     dialect: DIALECT,
//     pool: pool,
//   });
//   pool.connect((err: unknown) => {
//     if (err instanceof Error) logger.error(err);
//     console.log("Connect to PostgreSQL successfully!");
//   });
//   module.exports = db;
// } else {
//   const db = new Sequelize(process.env.POSTGRES_URL);
//   module.exports = db;
// }

// //const config = require("./config")
// //const sequelize = new sequelize(config[env]);
