const { HOST, PASSWORD, USERNAME, DATABASE } = require(".");
const sequelize = require("sequelize");
const db = new sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "postgres",
});

module.exports = db;
