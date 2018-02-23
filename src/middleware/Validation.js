/**
 * @fileOverview Validation middleware
 *
 * @author Franklin Chieze
 *
 * @requires NPM:validatorjs
 */

import Validator from 'validatorjs';

const signinUserRules = {
  email: 'required|email',
  password: 'required|string'
};
const signupUserRules = {
  email: 'required|email',
  name: 'required|string',
  password: 'required|string'
};
const teamRules = {
  name: 'required|string',
  description: 'string'
};

/**
* Middleware for validations
* @class Validation
*/
export default class Validation {
  /**
  * Validate sign in user data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async validateSigninUser(req, res, next) {
    const validation = new Validator(req.body, signinUserRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('email'),
      ...validation.errors.get('password')
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate sign up user data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async validateSignupUser(req, res, next) {
    const validation = new Validator(req.body, signupUserRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('email'),
      ...validation.errors.get('name'),
      ...validation.errors.get('password')
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate team data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async validateTeam(req, res, next) {
    const validation = new Validator(req.body, teamRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('name'),
      ...validation.errors.get('description')
    ]));
    validation.passes(() => next());
  }
}
