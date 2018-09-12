module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Favorites', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        }
      },
      teamId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Teams',
          key: 'id',
          as: 'teamId',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Favorites')
};
