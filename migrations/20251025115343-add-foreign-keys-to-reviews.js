'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
   
    await queryInterface.addConstraint('reviews', {
      fields: ['courseId'],
      type: 'foreign key',
      name: 'fk_reviews_course',
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('reviews', 'fk_reviews_course');
  },
};
