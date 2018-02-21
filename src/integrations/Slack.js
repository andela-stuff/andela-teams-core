/**
 * @fileOverview Slack Integration
 *
 * @author Franklin Chieze
 *
 * @requires NPM:axios
 */

import axios from 'axios';

import config from '../config';

/**
* @class Channel
*/
class Channel {
  /**
   * @method create
   * @desc This method creates a new Slack channel
   *
   * @param { string } name the name of the channel
   * @param { object } configuration the config with which to create the channel
   *
   * @returns { object } a response object showing the result of the operation
   */
  async create(name, configuration = { private: false }) {
    try {
      // create channel
      const createChannelResponse =
      await axios({
          url: 'https://slack.com/api/channels.create',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.SLACK_APP_TOKEN}`
          },
          data: {
            name,
            validate: true
          }
        });
      console.log(createChannelResponse);
      // set channel's purpose
      // set channel's topic
    } catch (error) {
      console.log(error);
    }
  }
}


/**
* Slack Integration
* @class Slack
*/
export default class Slack {
  /**
   * @constructor
   */
  constructor() {
    this.channel = new Channel();
  }
}