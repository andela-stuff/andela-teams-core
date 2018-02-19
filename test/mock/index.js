export default {
  user0: {
    name: 'user0',
    email: 'user0@email.com',
    password: 'password'
  },
  user1: {
    name: 'user1',
    email: 'user1@email.com',
    password: 'password'
  },
  user1WithMalformedEmail: {
    name: 'user1',
    email: 'user@emailcom',
    password: 'password'
  },
  user2WithMalformedEmail: {
    name: 'user2',
    email: 'useremail.com',
    password: 'password'
  },
  user3WithMalformedEmail: {
    name: 'user1',
    email: 'user@email.',
    password: 'password'
  }
};
