"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Users", "avatar", "avatarUrl");
    await queryInterface.addColumn("Users", "avatarId", {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "avatarId");
    await queryInterface.renameColumn("Users", "avatarUrl", "avatar");
  },
};
