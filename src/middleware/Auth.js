/**
 * @fileOverview Auth middleware
 *
 * @author Franklin Chieze
 *
 * @requires NPM:jsonwebtoken
 * @requires ../config
 * @requires ../models
 */

import jwt from 'jsonwebtoken';

import config from '../config';
import models from '../models';

/**
* Middleware for authentication and authorization
* @class Auth
*/
export default class Auth {
  /**
  * Authenticates user
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {json} json with user token
  */
  async authenticateUser(req, res, next) {
    try {
      const userToken = req.headers['x-teams-user-token'];
      if (!userToken) {
        throw new Error('Request has no user token header.');
      }

      const userData = jwt.verify(userToken, config.SECRET);
      const user = await models.User.findOne({
        where: { email: userData.email },
        attributes: { exclude: ['password'] }
      });

      if (user) {
        req.authUser = user.get();
        req.authUserObj = user;
        return next();
      }

      throw new Error('User is not authenticated.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
