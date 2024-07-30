"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      { name: "Technology", createdAt: new Date(), updatedAt: new Date() },
      { name: "Sports", createdAt: new Date(), updatedAt: new Date() },
      { name: "Health", createdAt: new Date(), updatedAt: new Date() },
      { name: "Entertainment", createdAt: new Date(), updatedAt: new Date() },
      { name: "Science", createdAt: new Date(), updatedAt: new Date() },
      { name: "Business", createdAt: new Date(), updatedAt: new Date() },
      { name: "Education", createdAt: new Date(), updatedAt: new Date() },
      { name: "Travel", createdAt: new Date(), updatedAt: new Date() },
      { name: "Food", createdAt: new Date(), updatedAt: new Date() },
      { name: "Lifestyle", createdAt: new Date(), updatedAt: new Date() },
    ];
    await queryInterface.bulkInsert("categories", categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
