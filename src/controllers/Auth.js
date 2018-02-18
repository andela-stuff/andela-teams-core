/**
 * @fileOverview Auth controller
 *
 * @author Franklin Chieze
 *
 * @requires NPM:bcrypt
 * @requires NPM:jsonwebtoken
 * @requires ../config
 * @requires ../models
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config';
import helpers from '../helpers';
import models from '../models';

/**
* Controls endpoints for authentication and authorization
* @class Auth
*/
export default class Auth {
  /**
   * Sign in a user
   * @param {obj} req express request object
   * @param {obj} res express response object
   *
   * @returns {json} json with user token
   */
  async signin(req, res) {
    try {
      const user = await models.User.findOne({
        where: { email: req.body.email }
      });
      if (user) {
        const isCorrectPassword =
        await bcrypt.compare(req.body.password, user.password);
        if (isCorrectPassword) {
          const userToken = jwt.sign({ email: user.email }, config.secret);
          const updatedUser = helpers.Misc.updateUserAttributes(user);
          return res.sendSuccess({ user: updatedUser, userToken });
        }

        throw new Error('The passwords did not match.');
      }

      throw new Error('No user was found with the supplied credentials.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Register a new user
  * @param {object} req express request object
  * @param {object} res express response object
  *
  * @returns {object} newly created user
  */
  async signup(req, res) {
    try {
      const existingUser = await models.User.findOne({
        where: { email: req.body.email }
      });
      if (existingUser) {
        throw new Error('User with the same email already exists.');
      }

      const user = await models.User.create({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(
          req.body.password,
          process.env.NODE_ENV === 'production' ? 10 : 1
        )
      });

      const userToken = jwt.sign({ email: user.email }, config.secret);
      const updatedUser = helpers.Misc.updateUserAttributes(user);

      return res.sendSuccess({ user: updatedUser, userToken });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
