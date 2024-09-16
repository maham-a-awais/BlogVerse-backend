import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { CommentAttributes } from "../types";

export class Comment extends Model implements CommentAttributes {
  id!: number;
  body!: string;
  userId!: number;
  postId!: number;
  parentCommentId?: number;
}

Comment.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "posts",
        key: "id",
      },
    },
    parentCommentId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: "Comments",
        key: "id",
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Comment",
  }
);

Comment.hasMany(Comment, {
  foreignKey: "parentCommentId",
  onDelete: "CASCADE",
  as: "replies",
});

Comment.belongsTo(Comment, {
  foreignKey: "parentCommentId",
  onDelete: "CASCADE",
  as: "parentComment",
});
