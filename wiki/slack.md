# Slack Integration

This file briefly explains how this project integrates with [Slack](https://slack.com/).

To integrate with Slack we create a [Slack app](https://api.slack.com/slack-apps). Our Slack app will be given the permissions we require. Our Slack app will need to be installed in the Slack workspace we wish to interact with. A token will be generated which is to be included in the `Authorization` header of every request we make to the slack API. This token is stored in the environment variable `SLACK_APP_TOKEN` or the config variable `SLACK_APP_TOKEN`, and can be used as shown below:

```javascript
headers: {
    Authorization: `Bearer ${config.SLACK_APP_TOKEN}`
}
```

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

* [Create a Channel](https://api.slack.com/methods/channels.create)

* [Set a Channel's Purpose](https://api.slack.com/methods/channels.setPurpose)

* [Set a Channel's Topic](https://api.slack.com/methods/channels.setTopic)
