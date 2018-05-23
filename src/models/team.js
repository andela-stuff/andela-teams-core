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
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
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
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Team.hasMany(models.Membership, {
      as: 'memberships',
      foreignKey: 'teamId',
    });
  };

  return Team;
};
