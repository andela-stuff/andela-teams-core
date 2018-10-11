module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        model: 'Teams',
        key: 'id',
        as: 'teamId',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Request.associate = (models) => {
    // associations can be defined here
    Request.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Request.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  return Request;
};
