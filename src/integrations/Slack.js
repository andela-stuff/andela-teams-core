/**
 * @fileOverview Slack Integration
 *
 * @author Franklin Chieze
 *
 * @requires NPM:axios
 * @requires ../config
 */

import axios from 'axios';
import client from '@slack/client';

import config from '../config';

// create Slack web client using the bot token
const botWebClient = new client.WebClient(config.SLACK_BOT_TOKEN);
// create Slack web client using the custom bot token
const customBotWebClient = new client.WebClient(config.SLACK_CUSTOM_BOT_TOKEN);
// create Slack web client using the user token
const userWebClient = new client.WebClient(config.SLACK_USER_TOKEN);


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
      const result = {}; // the result to be returned

      if (configuration.private) {
        //
      } else {
        // create channel
        const createChannelResponse = await userWebClient.channels.create(name);
        result.createdChannel = createChannelResponse;

        if (createChannelResponse.ok) {
          // invite bot to channel
          const inviteBotResponse =
          await userWebClient.channels.invite(
              createChannelResponse.channel.id,
              config.SLACK_BOT_ID
            );
          result.invitedBot = inviteBotResponse;
          // invite custom bot to channel
          const inviteCustomBotResponse =
          await userWebClient.channels.invite(
              createChannelResponse.channel.id,
              config.SLACK_CUSTOM_BOT_ID
            );
          result.invitedCustomBot = inviteCustomBotResponse;
          // set channel's purpose
          if (configuration.purpose && inviteCustomBotResponse.ok) {
            const setPurposeResponse =
            await customBotWebClient.channels.setPurpose(
                createChannelResponse.channel.id,
                configuration.purpose
              );
            result.setPurpose = setPurposeResponse;
          }

          // set channel's topic
          if (configuration.topic && inviteCustomBotResponse.ok) {
            const setTopicResponse =
            await customBotWebClient.channels.setTopic(
                createChannelResponse.channel.id,
                configuration.topic
              );
            result.setTopic = setTopicResponse;
          }
        }
      }

      return result;
    } catch (error) {
      return {
        createdChannel: {
          ok: false,
          error: 'uncaught_exception',
          detail: error.message
        }
      };
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
