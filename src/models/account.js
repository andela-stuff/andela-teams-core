module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'There is no description for this account'
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        'github_org', 'github_repo', 'pt_org', 'pt_project',
        'slack_group', 'slack_org', 'slack_channel'
      ],
      defaultValue: 'slack_channel'
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Teams',
        key: 'id',
        as: 'teamId',
      },
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  Account.associate = (models) => {
    Account.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  return Account;
};
