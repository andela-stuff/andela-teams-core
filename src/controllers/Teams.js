/**
 * @fileOverview Teams Controller
 *
 * @author Franklin Chieze
 *
 * @requires ../models
 */

import models from '../models';

/**
* Controls endpoints for teams
* @class Teams
*/
export default class Teams {
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
    return res.status(200).send({
      data: { name: 'team1' }
    });
  }

  /**
   * @method deleteById
   * @desc This method deletes the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async deleteById(req, res) {
    return res.status(200).send({
      data: { name: 'team1' }
    });
  }

  /**
   * @method getById
   * @desc This method get the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async getById(req, res) {
    return res.status(200).send({
      data: { name: 'team1' }
    });
  }

  /**
   * @method get
   * @desc This method gets an array of teams
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async get(req, res) {
    return res.status(200).send({
      data: [{ name: 'team1' }, { name: 'team2' }]
    });
  }

  /**
   * @method updateById
   * @desc This method updates the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async updateById(req, res) {
    return res.status(200).send({
      data: { name: 'team1' }
    });
  }

  /**
   * @method createMembership
   * @desc This method creates a new membership
   * in the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async createMembership(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
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
   * @method getMembershipById
   * @desc This method gets the team membership with the specified member ID
   * from the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async getMembershipById(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
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
