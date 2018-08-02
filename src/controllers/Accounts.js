/**
 * @fileOverview Accounts Controller
 *
 * @author Franklin Chieze
 *
 * @requires ../config
 * @requires ../integrations
 * @requires ../helpers
 * @requires ../models
 */

import config from '../config';
import Github from '../integrations/Github';
import PivotalTracker from '../integrations/PivotalTracker';
import Slack from '../integrations/Slack';
import helpers from '../helpers';
import models from '../models';

const { Op } = models.Sequelize;
const githubIntegration = new Github();
const ptIntegration = new PivotalTracker();
const slackIntegration = new Slack();

/**
* Controls endpoints for team accounts
* @class Accounts
*/
export default class Accounts {
  /**
   * @method create
   * @desc This method invites a user
   * to the account with the specified account ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async addUser(req, res) {
    try {
      let response;

      if (req.existingAccount.type === 'pt_project') {
        let role;
        switch (req.existingMember.role) {
          case 'lead':
            role = 'owner';
            break;
          case 'developer':
            role = 'member';
            break;
          case 'member':
            role = 'member';
            break;
          default:
            role = 'viewer';
        }
        response =
        await ptIntegration.project.addUser(
            req.existingAccount.response.created.id,
            req.existingUser.email,
            {
              role,
            }
          );

        return res.sendSuccess({ response });
      }
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
  /**
   * @method create
   * @desc This method creates a new account
   * for the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async create(req, res) {
    try {
      const existingAccount = await models.Account.findOne({
        where: { teamId: req.params.teamId, name: req.body.name }
      });
      if (existingAccount) {
        throw new
        Error('Account with the same name already exists in this team.');
      }

      if (!req.body.description) {
        req.body.description = 'There is no description for this account';
      }
      if (!req.body.type) {
        req.body.type = 'slack_channel';
      }

      let response;

      if (req.body.type === 'github_repo') {
        response =
        await githubIntegration.repo.create(
            req.body.name,
            {
              private: false,
              description: req.body.description,
              organization: config.GITHUB_ORGANIZATION,
              type: 'org'
            }
          );

        if (response.created.ok === false) {
          throw new Error('Could not create Github repo.');
        }

        // TODO: invite the current user to the repo

        req.body.url = response.created.html_url;
      } else if (req.body.type === 'pt_project') {
        response =
        await ptIntegration.project.create(
            req.body.name,
            {
              accountId: config.PIVOTAL_TRACKER_ACCOUNT_ID,
              description: req.body.description,
              public: true,
              user: req.user // invite the current user to the project
            }
          );

        if (response.created.ok === false) {
          throw new Error('Could not create Pivotal Tracker project.');
        }

        req.body.url = `https://www.pivotaltracker.com/projects/${response.created.id}`;
      } else if (req.body.type === 'slack_channel' ||
      req.body.type === 'slack_group') {
        response =
        await slackIntegration.channel.create(
            req.body.name,
            {
              private: (req.body.type === 'slack_group'),
              purpose: req.body.description,
              topic: req.existingTeam.description
            }
          );

        if (response.created.ok === false) {
          throw new Error('Could not create Slack channel or group.');
        }

        // TODO: invite the current user to the channel/group

        req.body.url =
        `/messages/${(req.body.type === 'slack_group') ? response.created.group.id : response.created.channel.id}`;
      }

      const account = await models.Account.create({
        ...req.body,
        response,
        teamId: req.params.teamId
      });

      return res.sendSuccess({ account });
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
