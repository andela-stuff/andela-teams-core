export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Teams',
        key: 'id',
        as: 'teamId',
      }
    }
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Favorite.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  return Favorite;
};
