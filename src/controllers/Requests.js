/**
 * @fileOverview Requests Controller
 *
 * @author Jacob Nouwatin
 *
 * @requires ../models
 */

import helpers from '../helpers';
import models from '../models';

const { Op } = models.Sequelize;

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

  /**
   * @method get
   * @desc This method fetch/get all requests
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async get(req, res) {
    try {
      const { limit, offset } = req.meta.pagination;
      const { query } = req.meta.search;
      const { attribute, order } = req.meta.sort;
      let { where } = req.meta.filter;

      // if search query is present, overwrite the 'where' so that
      // the 'name' and 'description' are checked to see if they contain
      // that search query (case-INsensitive)
      if (query) {
        where = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } }
          ]
        };
      }

      const dbResult = await models.Request.findAndCountAll({ where });
      const requests = await models.Request.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]],
        include: [
          { model: models.User, as: 'user' },
        ]
      });
      if (requests) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedRequests = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const request of requests) {
          // eslint-disable-next-line no-await-in-loop
          const r = await helpers.Misc.updateRequestAttributes(request);
          updatedRequests.push(r);
        }

        return res.sendSuccess(
          { requests: updatedRequests },
          200,
          { pagination }
        );
      }

      throw new Error('Could not retrieve requests from the database.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
