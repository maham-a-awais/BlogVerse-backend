import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
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

  down: async (queryInterface: QueryInterface) => {
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
