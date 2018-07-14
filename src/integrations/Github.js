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
  async create(name, configuration = { type: 'org' }) {
    try {
      const result = {}; // the result to be returned

      // create repo
      let createRepoResponse;
      if (configuration.type === 'org') {
        requestOptions.uri = `/orgs/${configuration.organization}/repos`;
        requestOptions.body = { name };
        const userRepoResponse = await request.post(requestOptions);
      } else if (configuration.type === 'user') {
        requestOptions.uri = '/user/repos';
        requestOptions.body = { name };
        const userRepoResponse = await request.post(requestOptions);
      }
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
