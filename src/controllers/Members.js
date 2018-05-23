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
   * @method getMemberships
   * @desc This method gets an array of all memberships
   * from the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async getMemberships(req, res) {
    return res.status(200).send({
      data: [
        { teamId: 1, userId: 1, role: 'LF' },
        { teamId: 2, userId: 2, role: 'PO' }
      ]
    });
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
