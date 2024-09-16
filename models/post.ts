import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { Comment } from "./comment";
import { PostAttributes } from "../types";

export class post extends Model implements PostAttributes {
  id!: number;
  title!: string;
  body!: string;
  minTimeToRead!: number;
  image!: string;
  thumbnail!: string;
  userId!: number;
  categoryId!: number;
  readonly updatedAt!: Date;
  readonly createdAt!: Date;
}

post.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    minTimeToRead: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    image: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    thumbnail: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "post",
  }
);

post.hasMany(Comment, {
  foreignKey: "postId",
  onDelete: "CASCADE",
});

Comment.belongsTo(post, {
  foreignKey: "postId",
});
