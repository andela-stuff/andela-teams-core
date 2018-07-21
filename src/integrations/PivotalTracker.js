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
    'X-TrackerToken': config.PIVOTAL_TRACKER_TOKEN, // //////////////////////////////////////////////////////////
  }
};

/**
* @class Repo
*/
class Project {
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
    configuration = { accountId: config.PIVOTAL_TRACKER_ACCOUNT_ID } // ///////////////////////////////////////////
  ) {
    try {
      const result = {}; // the result to be returned

      // create project
      let createProjectResponse;
      requestOptions.uri = '/projects';
      requestOptions.formData = {
        name,
        account_id: configuration.accountId,
        no_owner: true // we set this to true because we don't want to auto-add
        // the user whose token was used to make this API call
        // (we will, instead, add the currently logged in user as owner later)
      };
      if (process.env.NODE_ENV === 'test') {
        // fetch dummy data //////////////////////////////////////////////////////////////////////////////////////
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
