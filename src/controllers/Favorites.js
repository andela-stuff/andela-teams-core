/**
 * @fileoverview Favorites Controller
 *
 * @author Ayelegun Kayode Michael
 *
 * @requires ../helpers
 * @requires ../models
 */

import helpers from '../helpers';
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
    * @param { object } req The request object
    * @param { object } res The response object
    *
    * @returns { object } response
    */
  async create(req, res) {
    try {
      const existingFavorite = await models.Favorite.findOne({
        where: { teamId: req.params.teamId, userId: req.user.id }
      });
      if (existingFavorite) {
        throw new Error('This user already favorited this team.');
      }

      const favorite = await models.Favorite.create({
        teamId: req.params.teamId,
        userId: req.user.id
      });

      return res.sendSuccess({ favorite });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
    * @method getFavorites
    * @desc This method gets an array of favorites
    *
    * @param { object } req The request object
    * @param { object } res The response object
    *
    * @returns { object } response
    */
  async get(req, res) {
    try {
      const { limit, offset } = req.meta.pagination;
      // const { query } = req.meta.search;
      const { attribute, order } = req.meta.sort;
      const { where } = req.meta.filter;

      // this endpoint currently does NOT recognize the '@search' query

      const dbResult = await models.Favorite.findAndCountAll({ where });
      const favorites = await models.Favorite.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]],
        include: [
          { model: models.Team, as: 'team' },
          { model: models.User, as: 'user' }
        ]
      });
      if (favorites) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedFavorites = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const favorite of favorites) {
          // eslint-disable-next-line no-await-in-loop
          const f = await helpers.Misc.updateFavoriteAttributes(favorite);
          updatedFavorites.push(f);
        }

        return res.sendSuccess(
          { favorites: updatedFavorites },
          200,
          { pagination }
        );
      }

      throw new Error('Could not retrieve favorites from the database.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method deleteById
   * @desc This method deletes a team from a user's favorites
   *
   * @param { object } req request
   * @param { object } res response
   *
   * @returns { object } response
   */
  async deleteById(req, res) {
    try {
      const existingFavorite = await models.Favorite.findOne({
        where: { teamId: req.params.teamId, userId: req.user.id }
      });
      if (existingFavorite) {
        await existingFavorite.destroy();
        return res.sendSuccess();
      }

      throw new Error('This user has not favorited this team.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method updateById
   * @desc This method toggles the favorite status on the team with the
   * specified ID
   *
   * @param { object } req request
   * @param { object } res response
   *
   * @returns { object } response
   */
  async updateById(req, res) {
    try {
      const existingFavorite = await models.Favorite.findOne({
        where: { teamId: req.params.teamId, userId: req.user.id }
      });
      if (existingFavorite) {
        existingFavorite.destroy();
        return res.sendSuccess();
      }

      const favorite = await models.Favorite.create({
        teamId: req.params.teamId,
        userId: req.user.id
      });

      return res.sendSuccess({ favorite });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
