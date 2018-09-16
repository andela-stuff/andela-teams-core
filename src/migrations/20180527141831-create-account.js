module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'There is no description for this account'
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      response: {
        type: Sequelize.JSON,
        allowNull: false,
        validate: {
          notEmpty: true
        }
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
      type: {
        type: Sequelize.STRING,
        defaultValue: 'slack_channel'
      },
      url: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Accounts')
};
