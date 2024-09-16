import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
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

  down: async (queryInterface: QueryInterface) => {
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
