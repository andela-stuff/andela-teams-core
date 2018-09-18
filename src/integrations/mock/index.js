export default {
  github: {
    createOrgRepoResponse1: {
      id: 140960259,
      node_id: 'MDEwOlJlcG9zaXRvcnkxNDA5NjAyNTk=',
      name: 'test-repo-3',
      full_name: 'nuclear-tests/test-repo-3',
      private: false,
      html_url: 'https://github.com/nuclear-tests/test-repo-3',
      description: 'First auto-created repository',
      organization: {
        login: 'nuclear-tests',
        id: 41114601,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjQxMTE0NjAx',
        avatar_url: 'https://avatars2.githubusercontent.com/u/41114601?v=4',
        html_url: 'https://github.com/nuclear-tests',
        type: 'Organization'
      }
    },
    createUserRepoResponse1: {
      id: 141013236,
      node_id: 'MDEwOlJlcG9zaXRvcnkxNDEwMTMyMzY=',
      name: 'test-repo-3',
      full_name: 'Chieze-Franklin/test-repo-3',
      private: false,
      html_url: 'https://github.com/Chieze-Franklin/test-repo-3',
      description: 'First auto-created repository'
    }
  },
  pivotalTracker: {
    addUserResponse1: {
      id: 16200,
      kind: 'project_membership',
      person:
      {
        kind: 'person',
        id: 106,
        name: 'Galen Marek',
        email: 'marek@sith.mil',
        initials: 'GM',
        username: 'starkiller'
      },
      project_id: 99,
      role: 'member'
    },
    createProjectResponse1: {
      id: 2186167,
      kind: 'project',
      name: 'test-project-1',
      public: false,
      project_type: 'private',
      account_id: 1050596
    }
  },
  slack: {
    createChannelResponse1: {
      ok: true,
      channel: {
        id: 'ABCD12345',
        name: 'slack_public_channel_1',
        is_channel: true,
        created: 1528749214,
        is_archived: false,
        is_general: false,
        unlinked: 0,
        creator: 'EFGH67890',
        name_normalized: 'slack_public_channel_1',
        is_shared: false,
        is_org_shared: false,
        is_member: true,
        is_private: false,
        is_mpim: false,
        last_read: '0000000000.000000',
        latest: null,
        unread_count: 0,
        unread_count_display: 0,
        members: [
          'EFGH67890'
        ],
        topic: {
          value: '',
          creator: '',
          last_set: 0
        },
        purpose: {
          value: '',
          creator: '',
          last_set: 0
        },
        previous_names: [],
        priority: 0
      }
    },
    createGroupResponse1: {
      ok: true,
      group: {
        id: 'ABCD12345',
        name: 'slack_public_group_1',
        is_channel: false,
        created: 1528749214,
        is_archived: false,
        is_general: false,
        unlinked: 0,
        creator: 'EFGH67890',
        name_normalized: 'slack_public_group_1',
        is_shared: false,
        is_org_shared: false,
        is_member: true,
        is_private: false,
        is_mpim: false,
        last_read: '0000000000.000000',
        latest: null,
        unread_count: 0,
        unread_count_display: 0,
        members: [
          'EFGH67890'
        ],
        topic: {
          value: '',
          creator: '',
          last_set: 0
        },
        purpose: {
          value: '',
          creator: '',
          last_set: 0
        },
        previous_names: [],
        priority: 0
      }
    },
    inviteBotResponse1: {
      ok: true
    },
    inviteCustomBotResponse1: {
      ok: true
    },
    setPurposeResponse1: {
      ok: true,
      purpose: 'purpose of channel'
    },
    setTopicResponse1: {
      ok: true,
      topic: 'topic of channel'
    }
  }
};
