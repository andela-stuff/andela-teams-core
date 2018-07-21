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
