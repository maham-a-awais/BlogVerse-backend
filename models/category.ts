import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { CategoryAttributes } from "../types";
import { post } from "./post";

export class category extends Model implements CategoryAttributes {
  id!: number;
  name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "category",
  }
);

post.belongsTo(category, {
  foreignKey: "categoryId",
});
