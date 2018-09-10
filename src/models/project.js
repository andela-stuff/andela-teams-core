module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Teams',
        key: 'id',
        as: 'teamId',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'The teamId field is required'
        },
        async findTeam(value) {
          const team = await sequelize.models.Team.findById(value);
          if (!team) {
            throw new Error(`A team with the id of ${value} does not exist`);
          }
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The name field is required'
        },
        async exist(value) {
          const existingProject = await Project.findOne({
            where: { teamId: this.teamId, name: value }
          });
          if (existingProject) {
            throw new
            Error('Project with the same name already exists in this team.');
          }
        }
      }
    },
    description: DataTypes.STRING,
    githubRepo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The githubRepo field is required'
        },
      }
    },
    ptProject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The ptProject field is required'
        },
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The startDate field is required'
        },
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The endDate field is required'
        },
      }
    }
  });

  Project.associate = (models) => {
    Project.belongsTo(models.Team, {
      as: 'project',
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  Project.getOr404 = async (id) => {
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      throw new Error(`Project with the id ${id} not found`);
    }
    return existingProject;
  };

  Project.validateTeam = async (project, teamId) => {
    const teamMatch = project.teamId === teamId;
    if (!teamMatch) {
      throw new Error(`This project does not belong to the team of id: ${teamId}`);
    }
    return teamMatch;
  };

  return Project;
};
