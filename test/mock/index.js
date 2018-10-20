import jwt from 'jsonwebtoken';

export default {
  account1: {
    name: 'account1',
    description: 'description of account1',
    type: 'slack_channel',
  },
  account1WithInvalidType: {
    name: 'account1',
    description: 'description of account1',
    type: 'invalid_type',
  },
  account1WithoutName: {
    description: 'description of account1',
    type: 'slack_channel',
  },
  account1WithoutType: {
    name: 'account1',
    description: 'description of account1',
  },
  account2: {
    name: 'account2',
    description: 'description of account2',
    type: 'slack_private_channel',
  },
  account3: {
    name: 'account3',
    description: 'description of account3',
    type: 'github_repo',
  },
  account4: {
    name: 'account4',
    description: 'description of account4',
    type: 'github_private_repo',
  },
  accountTypeGithubRepo1: {
    name: 'github_repo_account1',
    description: 'description of account1',
    type: 'github_repo',
  },

  accountTypePivotalTrackerProject1: {
    name: 'pt_project_account1',
    description: 'description of account1',
    type: 'pt_project',
  },
  team1: {
    name: 'team1',
    description: 'description of team1',
    photo: 'https://www.myphotos.com/1',
  },
  team2: {
    name: 'team2',
    description: 'description of team2',
    photo: 'https://www.myphotos.com/2',
    private: true,
    progress: 50
  },
  team3: {
    name: 'team3',
    description: 'description of team3',
    photo: 'https://www.myphotos.com/3',
  },
  team4: {
    name: 'team4',
    description: 'description of team4',
    photo: 'https://www.myphotos.com/4',
  },
  team5: {
    name: 'team5',
    description: 'description of team5',
    photo: 'https://www.myphotos.com/5',
  },
  team6: {
    name: 'team6',
    description: 'description of team5',
    photo: 'https://www.myphotos.com/5',
  },
  team1WithoutOptionalProperties: {
    name: 'team1'
  },
  team2WithoutOptionalProperties: {
    name: 'team2'
  },
  team1WithoutName: {
    description: 'description of team1',
    photo: 'https://www.myphotos.com/1',
  },
  user0: {
    displayName: 'user0',
    email: 'user0@andela.com',
    githubUsername: 'user0',
    googleId: 123450,
    photo: 'https://www.myphotos.com/0',
    role: 'admin',
    slackId: '1234560'
  },
  user1: {
    displayName: 'user1',
    email: 'user1@andela.com',
    githubUsername: 'user1',
    googleId: 123451,
    photo: 'https://www.myphotos.com/1',
    slackId: '1234561'
  },
  user2: {
    displayName: 'user2',
    email: 'user2@andela.com',
    githubUsername: 'user2',
    googleId: 123452,
    photo: 'https://www.myphotos.com/2',
    slackId: '1234562'
  },
  user3: {
    displayName: 'user3',
    email: 'user3@andela.com',
    githubUsername: 'user3',
    googleId: 123453,
    photo: 'https://www.myphotos.com/3',
    slackId: '1234563'
  },
  user4: {
    displayName: 'user4',
    email: 'user4@andela.com',
    githubUsername: 'user4',
    googleId: 123454,
    photo: 'https://www.myphotos.com/4',
    slackId: '1234564'
  },
  user5: {
    displayName: 'user5',
    email: 'user5@andela.com',
    githubUsername: 'user5',
    googleId: 123455,
    photo: 'https://www.myphotos.com/5',
    slackId: '1234565'
  },
  user1Blocked: {
    blocked: true,
    displayName: 'user1',
    email: 'user1@andela.com',
    githubUsername: 'user1',
    googleId: 123451,
    photo: 'https://www.myphotos.com/1',
    slackId: '1234561'
  },
  user1WithNonAndelaEmail: {
    displayName: 'user1',
    email: 'user1@email.com',
    githubUsername: 'user1',
    googleId: 12345,
    photo: 'https://www.myphotos.com/1',
    slackId: '123456'
  },
  user1WithMalformedEmail: {
    displayName: 'user1',
    email: 'user1@andelacom',
    githubUsername: 'user1',
    googleId: 12345,
    photo: 'https://www.myphotos.com/1',
    slackId: '123456'
  },
  user2WithMalformedEmail: {
    displayName: 'user2',
    email: 'user2andela.com',
    githubUsername: 'user2',
    googleId: 12345,
    photo: 'https://www.myphotos.com/2',
    slackId: '123456'
  },
  user3WithMalformedEmail: {
    displayName: 'user3',
    email: 'user3@andela.',
    githubUsername: 'user3',
    googleId: 12345,
    photo: 'https://www.myphotos.com/3',
    slackId: '123456'
  },
  user1WithoutEmail: {
    displayName: 'user1',
    githubUsername: 'user1',
    googleId: 12345,
    photo: 'https://www.myphotos.com/1',
    slackId: '123456'
  },
  user1WithoutDisplayName: {
    email: 'user1@andela.com',
    githubUsername: 'user1',
    googleId: 12345,
    photo: 'https://www.myphotos.com/1',
    slackId: '123456'
  },
  user1WithoutGithubUsername: {
    displayName: 'user1',
    email: 'user1@andela.com',
    googleId: 12345,
    photo: 'https://www.myphotos.com/1',
    slackId: '123456'
  },
  user1WithoutGoogleId: {
    displayName: 'user1',
    email: 'user1@andela.com',
    githubUsername: 'user1',
    photo: 'https://www.myphotos.com/1',
    slackId: '123456'
  },
  user1WithoutSlackId: {
    displayName: 'user1',
    email: 'user1@andela.com',
    githubUsername: 'user1',
    googleId: 12345,
    photo: 'https://www.myphotos.com/1',
  },
  adminRequest: {
    type: 'admin_request'
  },
  adminRequest1: {
    type: 'admin_request'
  },
  adminRequestWithNumericData: {
    data: 1234
  },
  adminRequestWithoutType: {
    data: 'Lead'
  }

};
