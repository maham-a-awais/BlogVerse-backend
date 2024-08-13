const { HOST, PASSWORD, USERNAME, DATABASE, DIALECT } = require(".");
const sequelize = require("sequelize");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
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

//const config = require("./config")
//const sequelize = new sequelize(config[env]);
