'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        // foreign key (can disable temporarily if needed)
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'INR',
      },

      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },

      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      paymentDetails: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      courseIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: false,
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
  },

  async down(queryInterface, Sequelize) {
    // Drop ENUM before dropping table to avoid errors
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_payments_status";
    `);
    await queryInterface.dropTable('payments');
  },
};
