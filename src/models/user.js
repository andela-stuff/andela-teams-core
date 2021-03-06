/**
 * @fileOverview user model
 *
 * @author Franklin Chieze
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    githubUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'member'
    },
    slackId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Membership, {
      as: 'memberships',
      foreignKey: 'userId',
    });
    User.hasMany(models.Team, {
      as: 'teams',
      foreignKey: 'userId',
    });
    User.hasMany(models.Favorite, {
      as: 'favorites',
      foreignKey: 'userId'
    });
  };

  return User;
};
