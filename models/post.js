"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.category, { foreignKey: "categoryId" });
      this.hasMany(models.Comment, {
        foreignKey: "postId",
        onDelete: "CASCADE",
      });
    }
  }
  post.init(
    {
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      minTimeToRead: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      thumbnail: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "post",
    }
  );
  return post;
};
