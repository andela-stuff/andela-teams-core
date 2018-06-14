module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      githubUsername: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM,
        values: [
          'admin', 'disabled', 'member'
        ],
        defaultValue: 'member'
      },
      slackId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    const result = queryInterface.dropTable('Users');

    // // manually drop "enum_Users_role" since Sequelize does not
    // // drop when dropping "Users"
    // queryInterface.sequelize.query('DROP TYPE "enum_Users_role";');
    // the above line tends to lead to some sequelize deadlock error
    // since I don't need it yet (I haven't altered the "role" ever)
    // I have commented it out

    return result;
  }
};
