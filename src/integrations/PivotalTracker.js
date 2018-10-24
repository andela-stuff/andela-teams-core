/**
 * @fileOverview Pivotal Tracker Integration
 *
 * @author Franklin Chieze
 *
 * @requires NPM:requestretry
 * @requires ./mock
 * @requires ../config
 */

import request from 'requestretry';

import mock from './mock';
import config from '../config';

const requestOptions = {
  baseUrl: 'https://www.pivotaltracker.com/services/v5',
  fullResponse: false,
  json: true,
  headers: {
    'Content-Type': 'application/json',
    'X-TrackerToken': config.PIVOTAL_TRACKER_TOKEN,
  }
};

/**
* @class Project
*/
class Project {
  /**
   * @method addUser
   * @desc This method adds a user to a Pivotal Tracker project
   *
   * @param { object } userEmail the email of the user to add
   * @param { string } projectId the ID of the project
   * @param { object } configuration the config with which to add the user
   *
   * @returns { object } a response object showing the result of the operation
   */
  async addUser(userEmail, projectId, configuration = { role: 'member' }) {
    try {
      const result = {}; // the result to be returned

      // add user
      let addUserResponse;
      requestOptions.uri = `/projects/${projectId}/memberships`;
      requestOptions.body = {
        email: userEmail,
        role: configuration.role
      };
      if (process.env.NODE_ENV === 'test') {
        addUserResponse = mock.pivotalTracker.addUserResponse1;
      } else {
        addUserResponse = await request.post(requestOptions);
      }

      if (addUserResponse.kind !== 'project_membership') {
        throw new
        Error(`Failed to add user '${userEmail}' to Pivotal Tracker project.`);
      }

      // for uniformity with the slack API (and easy error detection)
      // add the 'ok' field
      result.ok = true;

      // to reduce the size of the JSON extract only needed fields
      result.id = addUserResponse.id;
      result.kind = addUserResponse.kind;
      result.person = addUserResponse.person;
      result.project_id = addUserResponse.project_id;
      result.role = addUserResponse.role;

      return result;
    } catch (error) {
      return {
        ok: false,
        error: 'uncaught_exception',
        detail: error.message
      };
    }
  }
  /**
   * @method create
   * @desc This method creates a new Pivotal Tracker project
   *
   * @param { string } name the name of the project
   * @param { object } configuration the config with which to create the project
   *
   * @returns { object } a response object showing the result of the operation
   */
  async create(
    name,
    configuration = { accountId: config.PIVOTAL_TRACKER_ACCOUNT_ID }
  ) {
    try {
      const result = {}; // the result to be returned

      // create project
      let createProjectResponse;
      requestOptions.uri = '/projects';
      requestOptions.body = {
        name,
        account_id: parseInt(configuration.accountId, 10),
        description: configuration.description,
        public: !(configuration.private),
        no_owner: true // we set this to true because we don't want to auto-add
        // the user whose token was used to make this API call
        // (we will, instead, add the currently logged in user as owner later)
      };
      if (process.env.NODE_ENV === 'test') {
        createProjectResponse = mock.pivotalTracker.createProjectResponse1;
      } else {
        createProjectResponse = await request.post(requestOptions);
      }

      if (createProjectResponse.kind !== 'project') {
        throw new Error(`Failed to create Pivotal Tracker project '${name}'.`);
      }

      result.created = {};

      // for uniformity with the slack API (and easy error detection)
      // add the 'ok' field
      result.created.ok = true;

      // to reduce the size of the JSON extract only needed fields
      result.created.id = createProjectResponse.id;
      result.created.kind = createProjectResponse.kind;
      result.created.name = createProjectResponse.name;
      result.created.public = createProjectResponse.public;
      result.created.project_type = createProjectResponse.project_type;
      result.created.account_id = createProjectResponse.account_id;

      // add current user to project
      if (configuration.user) {
        result.invitedUser = await this.addUser(
          configuration.user.email,
          result.created.id,
          { role: 'owner' }
        );
      }

      return result;
    } catch (error) {
      return {
        created: {
          ok: false,
          error: 'uncaught_exception',
          detail: error.message
        }
      };
    }
  }
  /**
   * @method addUser
   * @desc This method fetches stories from a Pivotal Tracker project
   *
   * @param { string } projectId the ID of the project
   * @param { object } options the options with which to fetch the stories
   *
   * @returns { object } a response object showing the result of the operation
   */
  async fetchStories(projectId, options = { }) {
    try {
      let storiesResponse;
      requestOptions.uri = `/projects/${projectId}/stories`;
      if (process.env.NODE_ENV === 'test') {
        storiesResponse = mock.pivotalTracker.addUserResponse1; // ************
      } else {
        storiesResponse = await request.get(requestOptions);
      }

      console.log(storiesResponse);

      const result = storiesResponse;

      // for uniformity with the slack API (and easy error detection)
      // add the 'ok' field
      result.ok = true;

      return result;
    } catch (error) {
      return {
        ok: false,
        error: 'uncaught_exception',
        detail: error.message
      };
    }
  }
}

/**
* Pivotal Tracker Integration
* @class PivotalTracker
*/
export default class PivotalTracker {
  /**
   * @constructor
   */
  constructor() {
    this.project = new Project();
  }
}
