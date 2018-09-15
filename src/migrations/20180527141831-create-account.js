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
        type: Sequelize.ENUM,
        values: [
          'github_org', 'github_private_repo', 'github_repo',
          'pt_org', 'pt_private_project', 'pt_project',
          'slack_channel', 'slack_group', 'slack_org'
        ],
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
  down: async (queryInterface, Sequelize) => {
    // const result = queryInterface.dropTable('Accounts');

    // // manually drop "enum_Accounts_type" since Sequelize does not
    // // drop when dropping "Accounts"
    // queryInterface.sequelize.query('DROP TYPE "enum_Accounts_type";');

    // return result;

    // const a = 1;
    // // await queryInterface.removeColumn('Accounts', 'type');
    // return queryInterface.addColumn('Accounts', 'type', {
    //   type: Sequelize.ENUM('github_org', 'github_private_repo', 'github_repo', 'pt_org', 'pt_private_project', 'pt_project', 'slack_channel', 'slack_group', 'slack_org'),
    //   defaultValue: 'slack_channel'
    // });
  }
};
