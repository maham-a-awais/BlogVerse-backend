"use strict";

/** @type {import('sequelize-cli').Migration} */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      DROP CONSTRAINT "Comments_userId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      ADD CONSTRAINT "Comments_userId_fkey"
      FOREIGN KEY ("userId")
      REFERENCES "Users" ("id")
      ON DELETE CASCADE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      DROP CONSTRAINT "Comments_userId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Comments"
      ADD CONSTRAINT "Comments_userId_fkey"
      FOREIGN KEY ("userId")
      REFERENCES "Users" ("id");
    `);
  },
};
