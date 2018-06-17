export default {
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
