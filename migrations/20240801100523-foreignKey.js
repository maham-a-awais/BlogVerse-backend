"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      DROP CONSTRAINT "posts_userId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "posts_userId_fkey"
      FOREIGN KEY ("userId")
      REFERENCES "Users" ("id")
      ON DELETE CASCADE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      DROP CONSTRAINT "posts_userId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "posts_userId_fkey"
      FOREIGN KEY ("userId")
      REFERENCES "Users" ("id");
    `);
  },
};
