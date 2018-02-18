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

/**
* Users controller class
* @class Users
*/
export default class Users {
  /**
   * @method deleteById
   * @desc This method deletes the user with the specified user ID
   *
   * @param { object } req request
   * @param { object } res response
   *
   * @returns { object } response
   */
  async deleteById(req, res) {
    return res.status(200).send({
      data: { name: 'user1' }
    });
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
    return res.status(200).send({
      data: { name: 'user1' }
    });
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
      const users = await models.User.findAll({
        attributes: { exclude: ['password'] }
      });
      if (users) {
        return res.sendSuccess({ users });
      }

      throw new Error('Could not retrieve users from the database.');
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
    return res.status(200).send({
      data: { name: 'user1' }
    });
  }
}
