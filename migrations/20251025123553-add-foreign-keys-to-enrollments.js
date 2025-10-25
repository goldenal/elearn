'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key to users (userId)
    await queryInterface.addConstraint('enrollments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_enrollments_user', // custom name
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Add foreign key to courses (courseId)
    await queryInterface.addConstraint('enrollments', {
      fields: ['courseId'],
      type: 'foreign key',
      name: 'fk_enrollments_course',
      references: {
        table: 'courses',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Add foreign key to payments (paymentId)
    await queryInterface.addConstraint('enrollments', {
      fields: ['paymentId'],
      type: 'foreign key',
      name: 'fk_enrollments_payment',
      references: {
        table: 'payments',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('enrollments', 'fk_enrollments_user');
    await queryInterface.removeConstraint('enrollments', 'fk_enrollments_course');
    await queryInterface.removeConstraint('enrollments', 'fk_enrollments_payment');
  },
};
