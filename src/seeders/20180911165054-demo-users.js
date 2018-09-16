'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Users', [{
      id: '63039d34-b5e1-11e8-96f8-529269fb1459',
      displayName: 'teebilz',
      email: 'user450@andela.com',
      githubUsername: 'user450',
      googleId: 12345045,
      photo: 'https://www.myphotos.com/0',
      role: 'admin',
      slackId: 123456045,
      createdAt: '2018-08-24 16:47:32.804+01',
      updatedAt: '2018-08-24 16:47:32.804+01'
    },
    {
      id: '422039b8-b5e3-11e8-96f8-529269fb1459',
      displayName: 'davchill',
      email: 'davchill@andela.com',
      githubUsername: 'user120',
      googleId: 3456789,
      photo: 'https://www.myphotos.com/0',
      role: 'admin',
      slackId: 9090586,
      createdAt: '2018-08-24 16:47:32.804+01',
      updatedAt: '2018-08-24 16:47:32.804+01'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
