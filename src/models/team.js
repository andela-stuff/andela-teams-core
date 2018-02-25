export default (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'There is no description for this team'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    }
  });

  Team.associate = (models) => {
    Team.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Team.hasMany(models.Membership, {
      foreignKey: 'teamId',
      as: 'memberships'
    });
  };

  return Team;
};
