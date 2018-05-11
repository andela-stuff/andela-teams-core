/**
 * @fileOverview Confirmation middleware
 *
 * @author Franklin Chieze
 *
 * @requires ../models
 */

import models from '../models';

/**
* Middleware for confirmations
* @class Confirmation
*/
export default class Confirmation {
  /**
  * Confirm that a team with the specified ID in the req params exists
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async confirmTeamById(req, res, next) {
    try {
      const existingTeam = await models.Team.findOne({
        where: { id: req.params.teamId }
      });
      if (!existingTeam) {
        throw new Error('Team with the specified ID does not exist.');
      }

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that a user with the specified ID in the req params exists
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async confirmUserById(req, res, next) {
    try {
      const existingUser = await models.User.findOne({
        where: { id: req.params.userId }
      });
      if (!existingUser) {
        throw new Error('User with the specified ID does not exist.');
      }

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that the currently authenticated user
  * is an admin of the team with the specified ID in the req params
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async confirmUserIsAdminInTeamById(req, res, next) {
    try {
      const existingAdmin = await models.Membership.findOne({
        where: {
          teamId: req.params.teamId,
          userId: req.user.id,
          role: 'admin'
        }
      });
      if (!existingAdmin) {
        throw new Error('This user in not an admin in this team.');
      }

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
