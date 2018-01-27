module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define('Membership', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  Membership.associate = (models) => {
    Membership.belongsTo(models.Team, {
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  return Membership;
};
