import fs from "fs";
import path from "path";
import { Sequelize, Dialect, DataTypes } from "sequelize";
import process from "process";
import { Pool } from "pg"; // pg typing
import { dbConfig } from "../config/config";
import { config as con } from "../config/index";

const basename = path.basename(__filename);
const env = (process.env.ENV as string) || "development";

interface EnvironmentConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
  dialect: string | undefined;
  use_env_variable?: string; // add this property
}

const environmentConfig: EnvironmentConfig = dbConfig[env];

export const db: { [key: string]: any } = {};

let sequelize: Sequelize;

// Initialize Sequelize based on configuration
if (environmentConfig.use_env_variable) {
  console.log("IN IF OF ENV CONFIG");
  sequelize = new Sequelize(process.env[environmentConfig.use_env_variable] as string, {
    dialect: con.DIALECT as Dialect, // Cast dialect as a valid Sequelize Dialect
    dialectModule: Pool, // pg (postgres) is a valid dialect module
  });
} else {
  console.log("IN ELSE OF ENV CONFIG");
  sequelize = new Sequelize(con.DB_URL!, {
    dialect: con.DIALECT as Dialect,
    dialectModule: Pool,
  });
}

// Read all models in the directory and initialize them
fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up associations if they exist
Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export sequelize and Sequelize instances
db.sequelize = sequelize;
db.Sequelize = Sequelize;
