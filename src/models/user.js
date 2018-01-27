module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
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
// relationship between user and membership
