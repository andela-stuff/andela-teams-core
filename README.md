# andela-teams-core

This is the core server side for __Andela Teams__.

[![Build Status](https://travis-ci.org/andela-stuff/andela-teams-core.svg?branch=master)](https://travis-ci.org/andela-stuff/andela-teams-core)
[![Hound CI](https://camo.githubusercontent.com/23ee7a697b291798079e258bbc25434c4fac4f8b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50726f7465637465645f62792d486f756e642d6138373364312e737667)](https://houndci.com)
[![CircleCI](https://circleci.com/gh/andela-stuff/andela-teams-core.svg?style=svg)](https://circleci.com/gh/andela-stuff/andela-teams-core)

Adela Teams seeks to automate some of the routine actions taken by __simulations learning facilitators__ at Andela.

Here is a useful scenario. When a new cohort (class) begins simulations (*sims*) at Andela, the cohort is broken into teams, and each team is assigned to a learning facilitator. The learning facilitator then creates a few Slack channels, a Github repo, and a Pivotal Tracker board. For each of these, the facilitator has to add every member of the team to the channel/repo/board. This is obviously a task that should be automated, especially considering that even the names of the channels/repo/board are always in a particular format. Andela Teams seeks to automate these and many more routine tasks perform by facilitators.

This server contains (or should contain) endpoints that perform various actions like:
* view, create, edit, delete teams
* add members to teams, in various capacities (fellow, TTL, PO, ...)
* add events to the Google Calendar of team members
* generate various Google docs (like scorecards for fellows)
* send out email notifications to team members

## Technology Stack

#### Server:
```
Back end implementation is built on NODE, using EXPRESS as the server and SEQUELIZE
as the ORM for communicating with the POSTGRES DB.
```

#### Authentication and Code Base Organization:
```
Written in ES6 and uses BABEL for transpiling down to ES5 and JWT for authentication.
```

#### Style Checking and Best Practices:
```
Uses ESLINT which was configured to use Airbnb-base rules for style checking
```

## Usage

## Testing

## API Docs

## Contributing

To see how to go about contributing to this project check the [contributing](contributing.md) file.

## Credits

## License

[MIT](LICENSE)

## FAQ

### Is this an Open-Source Application?

```
Yes it is, and contributing to the development of this application is by raising PRs.
```

### Who can contribute?

```
Anyone! This application is open to all those who want to contribute to open-source 
development and are willing to follow set standards for contributing.
```

### Is there a set standard for PRs to this repository?

```
Yes, there are set conventions for PRs to this repository and can be found in the 
project wiki.
```

### What language was used to develop this application?

```
This project is a full stack Javascript application.
```

### Can I clone this application for personal use?

```
Yes! This application is licensed under MIT, and is open for whatever you may choose 
to use it for.
```
