'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('lessons', {
      fields: ['moduleId'],
      type: 'foreign key',
      name: 'fk_lessons_moduleId_courseModules', // custom constraint name
      references: {
        table: 'course_modules',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'lessons',
      'fk_lessons_moduleId_courseModules'
    );
  },
};
