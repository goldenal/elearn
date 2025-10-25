'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint: progress.enrollmentId → enrollments.id
    await queryInterface.addConstraint('progress', {
      fields: ['enrollmentId'],
      type: 'foreign key',
      name: 'fk_progress_enrollment', // custom name for constraint
      references: {
        table: 'enrollments',
        field: 'id',
      },
      onDelete: 'CASCADE', // delete progress if enrollment is deleted
      onUpdate: 'CASCADE',
    });

    // Add foreign key constraint: progress.lessonId → lessons.id
    await queryInterface.addConstraint('progress', {
      fields: ['lessonId'],
      type: 'foreign key',
      name: 'fk_progress_lesson',
      references: {
        table: 'lessons',
        field: 'id',
      },
      onDelete: 'CASCADE', // delete progress if lesson is deleted
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraints on rollback
    await queryInterface.removeConstraint('progress', 'fk_progress_enrollment');
    await queryInterface.removeConstraint('progress', 'fk_progress_lesson');
  },
};
