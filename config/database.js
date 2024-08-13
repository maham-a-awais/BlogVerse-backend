const { HOST, PASSWORD, USERNAME, DATABASE, DIALECT } = require(".");
const sequelize = require("sequelize");
const { Pool } = require("pg");

if (process.env.ENV === "development") {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
  const db = new sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
    pool: pool,
  });
  pool.connect((err) => {
    if (err) throw err;
    console.log("Connect to PostgreSQL successfully!");
  });
  module.exports = db;
} else {
  const db = new sequelize(process.env.POSTGRES_URL);
  module.exports = db;
}

//const config = require("./config")
//const sequelize = new sequelize(config[env]);
