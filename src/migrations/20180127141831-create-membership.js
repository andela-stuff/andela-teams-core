module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Memberships', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'member'
      },
      teamId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Teams',
          key: 'id',
          as: 'teamId',
        },
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface, Sequelize) => {
    const result = queryInterface.dropTable('Memberships');

    // manually drop "enum_Memberships_role" since Sequelize does not
    // drop when dropping "Memberships"
    queryInterface.sequelize.query('DROP TYPE "enum_Memberships_role";');

    return result;
  }
};
