/**
 * @fileOverview Members Controller
 *
 * @author Franklin Chieze
 *
 * @requires ../helpers
 * @requires ../models
 */

import helpers from '../helpers';
import models from '../models';

const { Op } = models.Sequelize;

/**
* Controls endpoints for team members
* @class Members
*/
export default class Members {
  /**
   * @method create
   * @desc This method creates a new membership
   * in the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async create(req, res) {
    try {
      const existingMember = await models.Membership.findOne({
        where: { teamId: req.params.teamId, userId: req.params.userId }
      });
      if (existingMember) {
        throw new Error('This user already exists in this team.');
      }

      const membership = await models.Membership.create({
        ...req.body,
        teamId: req.params.teamId,
        userId: req.params.userId
      });

      return res.sendSuccess({ membership });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method deleteMembershipById
   * @desc This method deletes the membership with the specified member ID
   * from the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async deleteMembershipById(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
  }

  /**
   * @method get
   * @desc This method gets an array of memberships
   * from the team with the specified team ID
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
      const { where } = req.meta.filter;

      // teamId must be included in the 'where'
      where.teamId = req.params.teamId;

      // this endpoint currently does NOT recognize the '@search' query

      const dbResult = await models.Membership.findAndCountAll({ where });
      const memberships = await models.Membership.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]],
        include: [
          { model: models.Team, as: 'team' },
          { model: models.User, as: 'user' }
        ]
      });
      if (memberships) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedMemberships = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const membership of memberships) {
          // eslint-disable-next-line no-await-in-loop
          const m = await helpers.Misc.updateMembershipAttributes(membership);
          updatedMemberships.push(m);
        }

        return res.sendSuccess(
          { memberships: updatedMemberships },
          200,
          { pagination }
        );
      }

      throw new Error('Could not retrieve memberships from the database.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method get2
   * @desc This method gets an array of memberships
   * from the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async get2(req, res) {
    try {
      const { limit, offset } = req.meta.pagination;
      const { query } = req.meta.search;
      const { attribute, order } = req.meta.sort;
      let { where } = req.meta.filter;

      // if search query is present, overwrite the 'where' so that
      // the 'temId' and 'userId' are checked to see if it contains
      // that search query (case-INsensitive)
      if (query) {
        where = {
          [Op.or]: [
            { role: { [Op.iLike]: `%${query}%` } },
            { teamId: { [Op.iLike]: `%${query}%` } },
            { userId: { [Op.iLike]: `%${query}%` } }
          ]
        };
      }

      const dbResult = await models.Membership.findAndCountAll({ where });
      const memberships = await models.Membership.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]],
        include: [
          { model: models.Team, as: 'team' },
          { model: models.User, as: 'user' }
        ]
      });
      if (memberships) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedMemberships = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const membership of memberships) {
          // eslint-disable-next-line no-await-in-loop
          const m = await helpers.Misc.updateMembershipAttributes(membership);
          updatedMemberships.push(m);
        }

        return res.sendSuccess(
          { memberships: updatedMemberships },
          200,
          { pagination }
        );
      }

      throw new Error('Could not retrieve memberships from the database.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method getById
   * @desc This method gets the team membership with the specified user ID
   * from the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async getById(req, res) {
    try {
      const membership = await models.Membership.findOne({
        where: { teamId: req.params.teamId, userId: req.params.userId },
        include: [
          { model: models.Team, as: 'team' },
          { model: models.User, as: 'user' }
        ]
      });
      if (!membership) {
        throw new Error('Membership with the specified IDs does not exist.');
      }

      return res.sendSuccess({ membership });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method updateMembershipById
   * @desc This method updates the membership with the specified member ID
   * in the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  async updateMembershipById(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
  }
}
