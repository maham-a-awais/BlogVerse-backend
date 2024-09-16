import { Dialect, Sequelize } from "sequelize";
import { config } from ".";
import { config as dotenvConfig } from "dotenv";
const { HOST, DIALECT } = config;
dotenvConfig();

export let sequelizeConnection: Sequelize = new Sequelize(process.env.POSTGRES_URL as string, {
  host: HOST,
  dialect: DIALECT as Dialect,
});
