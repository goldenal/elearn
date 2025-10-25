'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('course_modules', {
      fields: ['courseId'],
      type: 'foreign key',
      name: 'fk_course_modules_courseId_courses',
      references: {
        table: 'courses',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('course_modules', 'fk_course_modules_courseId_courses');
  },
};
