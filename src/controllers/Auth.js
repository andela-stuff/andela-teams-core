/**
 * @fileOverview Auth controller
 *
 * @author Franklin Chieze
 *
 * @requires NPM:bcrypt
 * @requires NPM:jsonwebtoken
 * @requires ../config
 * @requires ../helpers
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
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {object} response object
   */
  async signin(req, res) {
    try {
      const user = await models.User.findOne({
        where: { email: req.body.email },
      });
      if (user) {
        // during sign in we can update the displayName and photo of the user
        let updatedUser =
        await user.update({
            displayName: req.body.displayName || user.displayName,
            photo: req.body.photo || user.photo
          });
        const userToken = jwt.sign({ email: user.email }, config.SECRET);
        updatedUser = helpers.Misc.updateUserAttributes(updatedUser);
        return res.sendSuccess({ user: updatedUser, userToken });
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
  * @returns {object} response object
  */
  async signup(req, res) {
    try {
      const existingUser = await models.User.findOne({
        where: { email: req.body.email }
      });
      if (existingUser) {
        throw new Error('User with the same email already exists.');
      }

      if (!req.body.email.toLowerCase().endsWith('@andela.com')) {
        throw new Error('Email address must be @andela.com');
      }

      const user = await models.User.create(
        req.body,
        {
          fileds:
          ['displayName', 'email', 'githubUsername', 'googleId', 'photo',
            'slackId']
        }
      );

      const userToken = jwt.sign({ email: user.email }, config.SECRET);
      const updatedUser = helpers.Misc.updateUserAttributes(user);

      return res.sendSuccess({ user: updatedUser, userToken });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
