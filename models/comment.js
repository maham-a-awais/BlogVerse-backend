"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Comment, {
        foreignKey: "parentCommentId",
        onDelete: "CASCADE",
        as: "replies",
      });
      this.belongsTo(models.Comment, {
        foreignKey: "parentCommentId",
        onDelete: "CASCADE",
        as: "parentComment",
      });
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Comment.init(
    {
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
