/**
 * @fileOverview Slack Integration
 *
 * @author Franklin Chieze
 *
 * @requires NPM:axios
 * @requires ./mock
 * @requires ../config
 */

import axios from 'axios';
import client from '@slack/client';

import mock from './mock';
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
    if (process.env.NODE_ENV === 'test') {
      return {};
    }

    try {
      const result = {}; // the result to be returned

      let { channels } = userWebClient; // public channels
      let customBotChannels = customBotWebClient.channels; // public channels

      if (configuration.private) {
        channels = userWebClient.groups; // private channels
        customBotChannels = customBotWebClient.groups; // private channels
      }
      // create channel
      let createChannelResponse;
      if (process.env.NODE_ENV === 'test') {
        createChannelResponse = mock.slack.createChannelResponse1;
      } else {
        createChannelResponse = await channels.create(name);
      }
      result.created = createChannelResponse;

      if (createChannelResponse.ok) {
        // invite bot to channel
        const channel =
        createChannelResponse.channel // public channel
        || createChannelResponse.group; // private channel
        let inviteBotResponse;
        if (process.env.NODE_ENV === 'test') {
          inviteBotResponse = mock.slack.inviteBotResponse1;
        } else {
          inviteBotResponse =
          await channels.invite(
              channel.id,
              config.SLACK_BOT_ID
            );
        }
        result.invitedBot = inviteBotResponse;
        // invite custom bot to channel
        let inviteCustomBotResponse;
        if (process.env.NODE_ENV === 'test') {
          inviteCustomBotResponse = mock.slack.inviteCustomBotResponse1;
        } else {
          inviteCustomBotResponse =
          await channels.invite(
              channel.id,
              config.SLACK_CUSTOM_BOT_ID
            );
        }
        result.invitedCustomBot = inviteCustomBotResponse;
        // set channel's purpose
        if (configuration.purpose && inviteCustomBotResponse.ok) {
          let setPurposeResponse;
          if (process.env.NODE_ENV === 'test') {
            setPurposeResponse = mock.slack.setPurposeResponse1;
          } else {
            setPurposeResponse =
            await customBotChannels.setPurpose(
                channel.id,
                configuration.purpose
              );
          }
          result.setPurpose = setPurposeResponse;
        }

        // set channel's topic
        if (configuration.topic && inviteCustomBotResponse.ok) {
          let setTopicResponse;
          if (process.env.NODE_ENV === 'test') {
            setTopicResponse = mock.slack.setTopicResponse1;
          } else {
            setTopicResponse =
            await customBotChannels.setTopic(
                channel.id,
                configuration.topic
              );
          }
          result.setTopic = setTopicResponse;
        }
      }

      // to reduce the size of the JSON delete some fields
      delete result.created.scopes;
      delete result.created.acceptedScopes;
      delete result.invitedBot.channel;
      delete result.invitedBot.group;
      delete result.invitedBot.scopes;
      delete result.invitedBot.acceptedScopes;
      delete result.invitedCustomBot.channel;
      delete result.invitedCustomBot.group;
      delete result.invitedCustomBot.scopes;
      delete result.invitedCustomBot.acceptedScopes;
      delete result.setPurpose.scopes;
      delete result.setPurpose.acceptedScopes;
      delete result.setTopic.scopes;
      delete result.setTopic.acceptedScopes;

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
