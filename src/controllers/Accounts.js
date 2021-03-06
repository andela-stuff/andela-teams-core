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
      const response = {};

      if (req.existingAccount.type === 'pt_project' || req.existingAccount.type === 'pt_private_project') {
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
        response.invitedUser =
        await ptIntegration.project.addUser(
          req.existingUser.email,
          req.existingAccount.response.created.id,
          {
            role,
          }
        );

        return res.sendSuccess({ response });
      } else if (req.existingAccount.type === 'github_repo' || req.existingAccount.type === 'github_private_repo') {
        let permission;
        switch (req.existingMember.role) {
          case 'lead':
            permission = 'admin';
            break;
          case 'developer':
            permission = 'push';
            break;
          case 'member':
            permission = 'pull';
            break;
          default:
            permission = 'pull';
        }
        response.invitedUser =
        await githubIntegration.repo.addUser(
          req.existingUser.githubUsername,
          req.existingAccount.response.created.name,
          {
            permission,
          }
        );

        return res.sendSuccess({ response });
      } else if (req.existingAccount.type === 'slack_channel' || req.existingAccount.type === 'slack_private_channel') {
        const channel = req.existingAccount.response.created.channel ||
        req.existingAccount.response.created.group;
        response.invitedUser =
        await slackIntegration.channel.addUser(
          req.existingUser.slackId,
          channel.id,
          {
            // private: !(!(req.existingAccount.response.created.group)),
            private: (typeof req.existingAccount.response.created.group !== 'undefined'),
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

      if (req.body.type === 'github_repo' ||
      req.body.type === 'github_private_repo') {
        response =
        await githubIntegration.repo.create(
          req.body.name,
          {
            private: (req.body.type === 'github_private_repo'),
            description: req.body.description,
            organization: config.GITHUB_ORGANIZATION,
            type: 'org',
            user: req.user // invite the current user to the repo
          }
        );

        if (response.created.ok === false) {
          throw new Error('Could not create Github repo.');
        }

        req.body.url = response.created.html_url;
      } else if (req.body.type === 'pt_project' ||
      req.body.type === 'pt_private_project') {
        response =
        await ptIntegration.project.create(
          req.body.name,
          {
            accountId: config.PIVOTAL_TRACKER_ACCOUNT_ID,
            description: req.body.description,
            private: (req.body.type === 'pt_private_project'),
            user: req.user // invite the current user to the project
          }
        );

        if (response.created.ok === false) {
          throw new Error('Could not create Pivotal Tracker project.');
        }

        req.body.url = `https://www.pivotaltracker.com/projects/${response.created.id}`;
      } else if (req.body.type === 'slack_channel' ||
      req.body.type === 'slack_private_channel') {
        response =
        await slackIntegration.channel.create(
          req.body.name,
          {
            private: (req.body.type === 'slack_private_channel'),
            purpose: req.body.description,
            topic: req.existingTeam.description,
            user: req.user // invite the current user to the project
          }
        );

        if (response.created.ok === false) {
          throw new Error('Could not create Slack channel or group.');
        }

        // TODO: invite the current user to the channel/group

        req.body.url =
        `/messages/${(req.body.type === 'slack_private_channel') ? response.created.group.id : response.created.channel.id}`;
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
   * @desc This method gets an object containing
   * an array of team with the specified team ID
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

      // Team id can be specified in the where
      where.teamId = req.params.teamId;
      // if search query is present, overwrite the 'where' so that
      // the 'name' and 'type' are checked to see if it contains
      // that search query (case-INsensitive)
      if (query) {
        where = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { type: { [Op.iLike]: `%${query}%` } }
          ]
        };
      }

      const dbResult = await models.Account.findAndCountAll({ where });
      const accounts = await models.Account.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]],
        include: [
          { model: models.Team, as: 'team' },
        ]
      });
      if (accounts) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedAccounts = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const account of accounts) {
          // eslint-disable-next-line no-await-in-loop
          const a = await helpers.Misc.updateAccountAttributes(account);
          updatedAccounts.push(a);
        }

        return res.sendSuccess(
          { accounts: updatedAccounts },
          200,
          { pagination }
        );
      }

      throw new Error('Could not retrieve accounts from the database.');
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
