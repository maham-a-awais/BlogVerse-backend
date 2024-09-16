import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.renameColumn("Users", "avatar", "avatarUrl");
    await queryInterface.addColumn("Users", "avatarId", {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Users", "avatarId");
    await queryInterface.renameColumn("Users", "avatarUrl", "avatar");
  },
};
