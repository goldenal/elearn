'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint for instructorId → users.id
    await queryInterface.addConstraint('courses', {
      fields: ['instructorId'],
      type: 'foreign key',
      name: 'fk_courses_instructor', // Custom constraint name
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE', // Delete course if instructor is deleted
      onUpdate: 'CASCADE', // Update instructorId if user id changes
    });

    // Add foreign key constraint for categoryId → categories.id
    await queryInterface.addConstraint('courses', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'fk_courses_category', // Custom constraint name
      references: {
        table: 'categories',
        field: 'id',
      },
      onDelete: 'SET NULL', // Set categoryId to NULL if category is deleted
      onUpdate: 'CASCADE', // Update categoryId if category id changes
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the foreign key constraints (rollback)
    await queryInterface.removeConstraint('courses', 'fk_courses_instructor');
    await queryInterface.removeConstraint('courses', 'fk_courses_category');
  },
};
