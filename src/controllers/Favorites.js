/**
 * @fileoverview Favorites Controller
 *
 * @author Ayelegun Kayode Michael
 *
 */
import models from '../models';

/**
 * Controls endpoints for teams
 * @class Favorites
 */
export default class Favorites {
  /**
    * @method addFavorite
    * @desc This method adds a team to a user's favorites
    *
    * @param { object } request The request object
    * @param { object } response The response object
    *
    * @returns { object } response
    */
  async create(request, response) {
    try {
      const { id } = request.user;
      const allFavorites = await models.Favorites.findAll({
        where: {
          teamId: request.existingTeam.dataValues.id
        }
      });
      if (allFavorites.length === 0) {
        const favoriteTeams = await models.Favorites.create({
          userId: id,
          teamId: request.existingTeam.dataValues.id,
        });
        return response.status(201).json({
          status: 'Success',
          message: 'Successfully added team to your list of favorites',
          favoriteTeams,
          userIDs: [id]
        });
      }
      const arrayUserIDs = [];
      allFavorites.map(favorite => arrayUserIDs
        .push(favorite.dataValues.userId));
      const userFavoriteTeams = allFavorites
        .filter(favorite => favorite.dataValues.userId === id)[0];

      if (arrayUserIDs.includes(id)) {
        const favoriteTeams = await models
          .Favorites.findById(userFavoriteTeams.dataValues.id);
        arrayUserIDs.map((user, index) => {
          if (arrayUserIDs[index] === id) {
            arrayUserIDs.splice(index, 1);
          }
        });
        favoriteTeams.destroy();
        return response.status(200).json({
          status: 'Success',
          message: 'Successfully removed team from your list of favorites',
          favoriteTeams,
          userIDs: arrayUserIDs
        });
      }
      const favoriteTeams = await models.Favorites.create({
        userId: id,
        teamId: request.existingTeam.id,
      });

      return response.status(201).json({
        message: 'Successfully added team to your favorites',
        teamData: request.params.teamId,
        favoriteTeams,
        userIDs: arrayUserIDs
      });
    } catch (error) {
      return response.sendFailure([error.message]);
    }
  }

  /**
    * @method getFavorites
    * @desc This method gets the user's favorites
    *
    * @param { object } request The request object
    * @param { object } response The response object
    *
    * @returns { object } response
    */
  async get(request, response) {
    try {
      const { userId } = request.params;
      const userFavorites = await models.Favorites.findAll({
        where: {
          userId
        },
        include: [
          {
            model: models.Team,
            as: 'teams',
          }
        ]
      });

      if (userFavorites.length === 0) {
        return response.status(200).json({
          status: 'Success',
          message: 'You currently have no favorite teams'
        });
      }

      const favoriteTeam = [];
      userFavorites.forEach(favorites => favoriteTeam
        .push(favorites.dataValues.teams.dataValues));

      return response.sendSuccess({
        status: 'Success',
        message: `You have ${userFavorites.length} favorite team(s)`,
        favoriteTeam
      }, 200);
    } catch (error) {
      return response.sendFailure([error.message]);
    }
  }
}
