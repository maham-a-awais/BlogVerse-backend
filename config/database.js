const { HOST, PASSWORD, USERNAME, DATABASE, DIALECT } = require(".");
const sequelize = require("sequelize");
const db = new sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
});

module.exports = db;
