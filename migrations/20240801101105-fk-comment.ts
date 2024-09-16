import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
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

  down: async (queryInterface: QueryInterface) => {
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
