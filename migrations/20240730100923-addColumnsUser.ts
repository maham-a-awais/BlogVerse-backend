import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn("Users", "avatar", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Users", "avatar");
  },
};
