/**
 * @fileOverview Requests Controller
 *
 * @author Jacob Nouwatin
 *
 * @requires ../models
 */

import models from '../models';

/**
* Controls endpoints for requests
* @class Requests
*/
export default class Requests {
  /**
   * @method create
   * @desc This method creates a new team
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async create(req, res) {
    try {
      const existingRequest = await models.Request.findOne({
        where: { userId: req.user.id, type: req.body.type }
      });
      if (existingRequest) {
        throw new Error('You have made a request with the same type.');
      }

      const request = await models.Request.create({
        ...req.body,
        userId: req.user.id
      });
      return res.sendSuccess({ request });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
