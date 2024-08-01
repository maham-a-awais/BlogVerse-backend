"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      DROP CONSTRAINT "Comments_parentCommentId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      ADD CONSTRAINT "Comments_parentCommentId_fkey"
      FOREIGN KEY ("parentCommentId")
      REFERENCES "Comments" ("id")
      ON DELETE CASCADE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      DROP CONSTRAINT "Comments_parentCommentId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      ADD CONSTRAINT "Comments_parentCommentId_fkey"
      FOREIGN KEY ("parentCommentId")
      REFERENCES "Comments" ("id");
    `);
  },
};
