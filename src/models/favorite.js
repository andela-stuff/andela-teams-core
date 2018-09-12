export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorites', {
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
      onDelete: 'CASCADE',
      foreignKey: 'userId'
    });
    Favorite.belongsTo(models.Team, {
      as: 'teams',
      foreignKey: 'teamId'
    });
  };

  return Favorite;
};
