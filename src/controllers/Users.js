/**
 * @fileOverview Users controller
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
* Users controller class
* @class Users
*/
export default class Users {
  /**
   * @method deleteById
   * @desc This method deletes the user with the specified user ID
   * This method is not yet implemented
   *
   * @param { object } req request
   * @param { object } res response
   *
   * @returns { object } response
   */
  async deleteById(req, res) {
    return res.sendFailure(['This operation is not yet supported.']);
  }

  /**
   * @method get
   * @desc This method gets an array of users
   *
   * @param { object } req request
   * @param { object } res response
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
      // the 'displayName', 'email', and 'githubUsername'
      // are checked to see if they contain
      // that search query (case-INsensitive)
      if (query) {
        where = {
          [Op.or]: [
            { displayName: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } },
            { githubUsername: { [Op.iLike]: `%${query}%` } }
          ]
        };
      }

      const dbResult = await models.User.findAndCountAll({ where });
      const users = await models.User.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]]
      });
      if (users) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedUsers = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const user of users) {
          // eslint-disable-next-line no-await-in-loop
          const u = await helpers.Misc.updateUserAttributes(user, req);
          updatedUsers.push(u);
        }

        return res.sendSuccess({ users: updatedUsers }, 200, { pagination });
      }

      throw new Error('Could not retrieve users from the database.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method getById
   * @desc This method get the user with the specified user ID
   *
   * @param { object } req request
   * @param { object } res response
   *
   * @returns { object } response
   */
  async getById(req, res) {
    try {
      const user =
      await helpers.Misc.updateUserAttributes(req.existingUser, req);

      return res.sendSuccess({ user });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method updateById
   * @desc This method updates the user with the specified user ID
   *
   * @param { object } req request
   * @param { object } res response
   *
   * @returns { object } response
   */
  async updateById(req, res) {
    try {
      // the only properties you can update using this endpoint are:
      // 'blocked', 'photo', 'role'

      const fieldsToUpdate = {};

      if (typeof req.body.blocked !== 'undefined') {
        // only an admin can update 'blocked'
        if (req.user.role !== 'admin') {
          throw new
          Error('You need admin privilege to block or unblock a user.');
        }

        // a user cannot update their own 'blocked'
        if (req.existingUser.id === req.user.id) {
          throw new
          Error('You cannot block or unblock yourself.');
        }

        fieldsToUpdate.blocked = req.body.blocked;
      }

      if (typeof req.body.role !== 'undefined') {
        // only an admin can update 'role'
        if (req.user.role !== 'admin') {
          throw new
          Error('You need admin privilege to assign roles to a user.');
        }

        // a user cannot update their own 'role'
        if (req.existingUser.id === req.user.id) {
          throw new
          Error('You cannot assign roles to yourself.');
        }

        fieldsToUpdate.role = req.body.role;
      }

      if (typeof req.body.photo !== 'undefined') {
        // you cannot update another user's 'photo'
        if (req.existingUser.id !== req.user.id) {
          throw new Error('Cannot update another user\'s photo.');
        }

        fieldsToUpdate.photo = req.body.photo;
      }

      if (typeof req.body.githubUsername !== 'undefined') {
        // you cannot update another user's 'githubUsername'
        if (req.existingUser.id !== req.user.id) {
          throw new Error('Cannot update another user\'s Github username.');
        }

        fieldsToUpdate.githubUsername = req.body.githubUsername;
      }

      if (typeof req.body.slackId !== 'undefined') {
        // you cannot update another user's 'slackId'
        if (req.existingUser.id !== req.user.id) {
          throw new Error('Cannot update another user\'s Slack ID.');
        }

        fieldsToUpdate.slackId = req.body.slackId;
      }

      const updatedUser = await req.existingUser.update(fieldsToUpdate);
      const user =
      await helpers.Misc.updateUserAttributes(updatedUser, req);

      return res.sendSuccess({ user });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
