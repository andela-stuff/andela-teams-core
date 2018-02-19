/**
 * @fileOverview user model
 *
 * @author Franklin Chieze
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Membership, {
      foreignKey: 'userId',
      as: 'memberships'
    });
    User.hasMany(models.Team, {
      foreignKey: 'userId',
      as: 'teams'
    });
  };

  return User;
};
