/**
 * @fileOverview Github Integration
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
  baseUrl: 'https://api.github.com',
  fullResponse: false,
  json: true,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${config.GITHUB_USER_TOKEN}`,
    'User-Agent': config.GITHUB_USER_AGENT,
  }
};

/**
* @class Repo
*/
class Repo {
  /**
   * @method addUser
   * @desc This method adds a user to a Github repo
   *
   * @param { string } username the Github username of the user to add
   * @param { object } repo the name of the repo
   * @param { object } configuration the config with which to add the user
   *
   * @returns { object } a response object showing the result of the operation
   */
  async addUser(username, repo, configuration = { organization: config.GITHUB_ORGANIZATION, permission: 'push' }) {
    try {
      const result = {}; // the result to be returned

      // just to be sure configuration.organization is not undefined
      configuration.organization =
      configuration.organization || config.GITHUB_ORGANIZATION;

      // add user
      let addUserResponse;
      requestOptions.uri = `/repos/${configuration.organization}/${repo}/collaborators/${username}`;
      requestOptions.headers.Accept = 'application/vnd.github.swamp-thing-preview+json';
      requestOptions.body = {
        permission: configuration.permission || 'push'
        // the default permission is 'push' so, technically, we don't need to
        // add the code snippet: || 'push'
        // nevertheless, adding it ensures that the body is NEVER empty
        // so we never need to set 'Content-Length' to zero
        // see: https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
      };
      if (process.env.NODE_ENV === 'test') {
        addUserResponse = mock.github.addUserResponse1;
      } else {
        addUserResponse = await request.put(requestOptions);
      }

      // if (typeof addUserResponse === 'undefined') { // confirm this**********
      //   throw new
      //   Error(`Failed to add user '${username}' to Github repo.`);
      // }

      // for uniformity with the slack API (and easy error detection)
      // add the 'ok' field
      result.ok = true;

      // to reduce the size of the JSON extract only needed fields
      if (addUserResponse && addUserResponse.invitee) {
        result.id = addUserResponse.id;
        result.repository = {};
        result.repository.id = addUserResponse.repository.id;
        result.repository.name = addUserResponse.repository.name;
        result.repository.full_name = addUserResponse.repository.full_name;
        result.repository.private = addUserResponse.repository.private;
        result.repository.html_url = addUserResponse.repository.html_url;
        result.repository.description = addUserResponse.repository.description;
        result.invitee = {};
        result.invitee.id = addUserResponse.invitee.id;
        result.invitee.html_url = addUserResponse.invitee.html_url;
        result.inviter = {};
        result.inviter.id = addUserResponse.inviter.id;
        result.inviter.html_url = addUserResponse.inviter.html_url;
        result.permissions = addUserResponse.permissions;
      }

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
   * @desc This method creates a new Github repo
   *
   * @param { string } name the name of the repo
   * @param { object } configuration the config with which to create the repo
   *
   * @returns { object } a response object showing the result of the operation
   */
  async create(
    name,
    configuration = { organization: config.GITHUB_ORGANIZATION, type: 'org' }
  ) {
    try {
      const result = {}; // the result to be returned

      // just to be sure configuration.organization is not undefined
      configuration.organization =
      configuration.organization || config.GITHUB_ORGANIZATION;

      // create repo
      let createRepoResponse;
      if (configuration.type === 'org') {
        requestOptions.uri = `/orgs/${configuration.organization}/repos`;
        requestOptions.body =
        {
          name,
          description: configuration.description,
          private: configuration.private
        };
        if (process.env.NODE_ENV === 'test') {
          createRepoResponse = mock.github.createOrgRepoResponse1;
        } else {
          createRepoResponse = await request.post(requestOptions);
        }
      } else if (configuration.type === 'user') {
        requestOptions.uri = '/user/repos';
        requestOptions.body =
        {
          name,
          description: configuration.description,
          private: configuration.private
        };
        if (process.env.NODE_ENV === 'test') {
          createRepoResponse = mock.github.createUserRepoResponse1;
        } else {
          createRepoResponse = await request.post(requestOptions);
        }
      }
      result.created = {};

      // for uniformity with the slack API (and easy error detection)
      // add the 'ok' field
      result.created.ok = true;

      // to reduce the size of the JSON extract only needed fields
      result.created.id = createRepoResponse.id;
      result.created.node_id = createRepoResponse.node_id;
      result.created.name = createRepoResponse.name;
      result.created.full_name = createRepoResponse.full_name;
      result.created.private = createRepoResponse.private;
      result.created.html_url = createRepoResponse.html_url;
      result.created.description = createRepoResponse.description;
      if (createRepoResponse.organization) {
        result.created.organization = {};
        result.created.organization.login =
        createRepoResponse.organization.login;
        result.created.organization.id = createRepoResponse.organization.id;
        result.created.organization.node_id =
        createRepoResponse.organization.node_id;
        result.created.organization.avatar_url =
        createRepoResponse.organization.avatar_url;
        result.created.organization.html_url =
        createRepoResponse.organization.html_url;
        result.created.organization.type = createRepoResponse.organization.type;
      }

      // add current user to repo
      if (configuration.user) {
        result.invitedUser = await this.addUser(
          configuration.user.githubUsername,
          result.created.name,
          { permission: 'admin' }
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
}

/**
* Github Integration
* @class Github
*/
export default class Github {
  /**
   * @constructor
   */
  constructor() {
    this.repo = new Repo();
  }
}
