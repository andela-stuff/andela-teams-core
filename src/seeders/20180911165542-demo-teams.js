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
    return queryInterface.bulkInsert('Teams', [{
      id: '93c70d82-b5e3-11e8-96f8-529269fb1459',
      name: 'teamtest',
      description: 'description of teamtest',
      photo: 'https://www.myphotos.com/2',
      private: true,
      progress: 50,
      userId: '63039d34-b5e1-11e8-96f8-529269fb1459',
      createdAt: '2018-08-24 16:47:32.804+01',
      updatedAt: '2018-08-24 16:47:32.804+01'
    },
    {
      id: 'c7b232ca-b5e3-11e8-96f8-529269fb1459',
      name: 'teamtrial',
      description: 'description of teamtrial',
      photo: 'https://www.myphotos.com/2',
      private: true,
      progress: 50,
      userId: '63039d34-b5e1-11e8-96f8-529269fb1459',
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
