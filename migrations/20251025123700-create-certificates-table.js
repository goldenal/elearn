'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('certificates', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
      },
      enrollmentId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      certificateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      certificateUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issuedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add Foreign Key Constraint: enrollmentId → enrollments.id
    await queryInterface.addConstraint('certificates', {
      fields: ['enrollmentId'],
      type: 'foreign key',
      name: 'fk_certificates_enrollment', // custom constraint name
      references: {
        table: 'enrollments',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('certificates', 'fk_certificates_enrollment');
    await queryInterface.dropTable('certificates');
  },
};
