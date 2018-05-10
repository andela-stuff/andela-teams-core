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
  * Confirm that a team with the specified ID exists
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
}
