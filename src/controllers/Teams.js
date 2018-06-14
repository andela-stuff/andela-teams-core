/**
 * @fileOverview Teams Controller
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
    try {
      const existingTeam = await models.Team.findOne({
        where: { name: req.body.name }
      });
      if (existingTeam) {
        throw new Error('Team with the same name already exists.');
      }

      const team = await models.Team.create({
        ...req.body,
        userId: req.user.id
      });

      // the user that creates a team should be
      // auto added to the team as 'lead'
      const lead = await models.Membership.create({
        role: 'lead',
        teamId: team.id,
        userId: req.user.id
      });

      const updatedTeam = await helpers.Misc.updateTeamAttributes(team, req);

      return res.sendSuccess({ team: updatedTeam });

      /* // Slack integration
      // get response, put it in returned json, create integrations
      const slackResponse =
      await slackIntegration.channel.create(
          team.name,
          {
            private: false,
            purpose: team.description,
            topic: 'This is a test topic'
          }
        );

      return res.sendSuccess({
        team,
        integrations: {
          slack: slackResponse
        }
      });
      */
    } catch (error) {
      return res.sendFailure([error.message]);
    }
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
   * @method get
   * @desc This method gets an array of teams
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

      const dbResult = await models.Team.findAndCountAll({ where });
      const teams = await models.Team.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]]
      });
      if (teams) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedTeams = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const team of teams) {
          // eslint-disable-next-line no-await-in-loop
          const t = await helpers.Misc.updateTeamAttributes(team, req);
          updatedTeams.push(t);
        }

        return res.sendSuccess({ teams: updatedTeams }, 200, { pagination });
      }

      throw new Error('Could not retrieve teams from the database.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
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
    try {
      const team =
      await helpers.Misc.updateTeamAttributes(req.existingTeam, req);

      // you can't view a private team that doesn't contain you
      if (team.private && !team.containsYou) {
        throw new Error('This team is private.');
      }

      return res.sendSuccess({ team });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
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
}
