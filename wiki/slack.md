# Slack Integration

This file briefly explains how this project integrates with [Slack](https://slack.com/).

There are 2 main ways to integrate with Slack: Slack Apps and Custom Integrations.

Slack App is the recommended way to integrate with Slack. *talk about this*
With respect to this project we get 2 tokens from Slack Apps: *user token* and *bot token*
user token is used to create channels
bot token is used to send messages with advanced formatting and fancy buttons

Custom integration... //https://api.slack.com/custom-integrations
//the section "Listen for and respond to messages with a bot user" shows how to create custom bot user
// we call it Andela Teams Admin (@andela-teams-admin)
// copy the member ID is env var: `SLACK_CUSTOM_BOT_ID`
The token gotten here is used to set a channel's purpose and topic

Workflow:
* use the user token to create a channel
* use the user token to invite the bots (both of them)
* use the custom bot token to set channel's purpose and topic
* use the modern bot token when posting fancing messages

To integrate with Slack we create a [Slack app](https://api.slack.com/slack-apps). Our Slack app will be given the permissions we require. Our Slack app also adds a bot agent to enable it interact with users in a more conversational manner. Our Slack app will need to be installed in the Slack workspace we wish to interact with. A token will be generated which is to be included in the `Authorization` header of every request we make to the slack API. This token is stored in the environment variable `SLACK_APP_TOKEN` or the config variable `SLACK_APP_TOKEN`, and can be used as shown below:

----


```javascript
headers: {
    Authorization: `Bearer ${config.SLACK_APP_TOKEN}`
}
```

To make requests to the Slack API a little easier, and to reduce the number of Slack-related tests we have to do, we will be using the [Node Slack SDK](https://github.com/slackapi/node-slack-sdk).

## Making the Slack App Distributable

## Resources

These are some relevant resources to look at:

* [Slack API](https://api.slack.com/)

-----

* [Slack API Tutorials](https://api.slack.com/tutorials)

* [Building a Slack Bot with Node.js and Chuck Norris Super Powers](https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers)

* [Create a custom Slack slash command with Node.js and Express](https://scotch.io/tutorials/create-a-custom-slack-slash-command-with-nodejs-and-express)

* [Building a Slack Bot with Modern Node.js Workflows](https://scotch.io/tutorials/building-a-slack-bot-with-modern-nodejs-workflows)

-----

* [Slack Web API](https://api.slack.com/web)

* [Slack Web API Methods](https://api.slack.com/methods)

* [Build Slack Apps Here](https://api.slack.com/apps)

* [Create a Public Channel](https://api.slack.com/methods/channels.create)

* [Set a Channel's Purpose](https://api.slack.com/methods/channels.setPurpose)

* [Set a Channel's Topic](https://api.slack.com/methods/channels.setTopic)

* [Create a Private Channel](https://api.slack.com/methods/groups.create)
