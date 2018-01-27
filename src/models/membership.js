module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define('Membership', {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE'
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
