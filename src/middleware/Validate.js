/**
 * @fileOverview Validate middleware
 *
 * @author Franklin Chieze
 *
 * @requires NPM:validatorjs
 */

import Validator from 'validatorjs';

const signinUserRules = {
  displayName: 'required|string',
  email: 'required|email',
  googleId: 'required|numeric',
  photo: 'string',
};
const signupUserRules = {
  displayName: 'required|string',
  email: 'required|email',
  githubUsername: 'required|string',
  googleId: 'required|numeric',
  photo: 'string',
  slackId: 'required|string',
};
const updateUserRules = {
  blocked: 'boolean',
  githubUsername: 'string',
  photo: 'string',
  role: 'in:admin,disabled,member',
  slackId: 'string',
};

const createTeamRules = {
  name: 'required|string',
  description: 'string',
  photo: 'string',
  privacy: 'boolean',
  progress: 'numeric'
};

const createProjectRules = {
  name: 'required|string',
  description: 'string',
  githubRepo: 'required|url',
  ptProject: 'required|url',
  startDate: 'required|date',
  endDate: 'required|date'
};

const updateProjectRules = {
  name: 'string',
  description: 'string',
  githubRepo: 'url',
  ptProject: 'url',
  startDate: 'date',
  endDate: 'date'
};

const createTeamAccountRules = {
  name: 'required|string',
  description: 'string',
  type: 'in:github_org,github_private_repo,github_repo,pt_private_project,pt_project,slack_channel,slack_group,slack_org',
};

const createTeamMemberRules = {
  role: 'in:developer,disabled,lead,member',
};

const createRequestRules = {
  type: 'in:admin_request,member_request',
  data: 'string'
};

/**
* Middleware for validations
* @class Validate
*/
export default class Validate {
  /**
  * Validate sign in user data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async signinUser(req, res, next) {
    const validation = new Validator(req.body, signinUserRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('displayName'),
      ...validation.errors.get('email'),
      ...validation.errors.get('googleId'),
      ...validation.errors.get('photo'),
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
  async signupUser(req, res, next) {
    const validation = new Validator(req.body, signupUserRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('displayName'),
      ...validation.errors.get('email'),
      ...validation.errors.get('githubUsername'),
      ...validation.errors.get('googleId'),
      ...validation.errors.get('photo'),
      ...validation.errors.get('slackId'),
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate create team data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async createTeam(req, res, next) {
    const validation = new Validator(req.body, createTeamRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('name'),
      ...validation.errors.get('description'),
      ...validation.errors.get('photo'),
      ...validation.errors.get('privacy'),
      ...validation.errors.get('progress'),
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate create project data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  * @param {object} rules the rules function
  *
  * @returns {any} the next middleware or controller
  */
  static async getProjectRules(req, res, next, rules) {
    const validation = new Validator(req.body, rules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('name'),
      ...validation.errors.get('description'),
      ...validation.errors.get('githubRepo'),
      ...validation.errors.get('ptProject'),
      ...validation.errors.get('startDate'),
      ...validation.errors.get('endDate'),
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate create project data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async createProject(req, res, next) {
    await Validate.getProjectRules(req, res, next, createProjectRules);
  }

  /**
  * Validate create project data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async updateProject(req, res, next) {
    Validate.getProjectRules(req, res, next, updateProjectRules);
  }

  /**
  * Validate create team account data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async createTeamAccount(req, res, next) {
    const validation = new Validator(req.body, createTeamAccountRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('name'),
      ...validation.errors.get('description'),
      ...validation.errors.get('type'),
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate create team member data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async createTeamMember(req, res, next) {
    const validation = new Validator(req.body, createTeamMemberRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('role'),
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate update user data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async updateUser(req, res, next) {
    const validation = new Validator(req.body, updateUserRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('blocked'),
      ...validation.errors.get('githubUsername'),
      ...validation.errors.get('photo'),
      ...validation.errors.get('role'),
      ...validation.errors.get('slackId'),
    ]));
    validation.passes(() => next());
  }

  /**
  * Validate create request data
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async createRequest(req, res, next) {
    const validation = new Validator(req.body, createRequestRules);
    validation.fails(() => res.sendFailure([
      ...validation.errors.get('type'),
      ...validation.errors.get('data'),
    ]));
    validation.passes(() => next());
  }
}
