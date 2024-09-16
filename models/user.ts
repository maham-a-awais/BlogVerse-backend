import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { post } from "./post";
import { Comment } from "./comment";
import { UserAttributes } from "../types";

export class User extends Model implements UserAttributes {
  id!: number;
  fullName!: string;
  email!: string;
  password!: string;
  isVerified?: boolean;
  avatarUrl?: string;
  avatarId?: string;
  readonly updatedAt!: Date;
  readonly createdAt!: Date;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isVerified: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    avatarUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    avatarId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "User",
  }
);

User.hasMany(post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

post.belongsTo(User, {
  foreignKey: "userId",
});
