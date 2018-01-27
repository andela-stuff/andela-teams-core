module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define('Membership', {
    role: {
      type: DataTypes.ENUM,
      values: [
        'admin', 'disabled', 'facilitator', 'fellow', 'member', 'po', 'ttl'
      ],
      defaultValue: 'member'
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
    Membership.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Membership.belongsTo(models.Team, {
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  return Membership;
};
