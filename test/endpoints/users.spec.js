/**
 * @fileOverview Tests for /v1/users
 *
 * @author Franklin Chieze
 *
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires NPM:jsonwebtoken
 * @requires ../mock
 * @requires ../../src/config
 * @requires ../../src/models
 * @requires ../../src/server
 */

import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';


import mock from '../mock';
import config from '../../src/config';
import models from '../../src/models';
import server from '../../src/server';

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

let user0 = {};
let user1 = {};

describe('Tests for /v1/users', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {} });
    user0 = await models.User.create(mock.user0);
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
    user0.token = mock.user0.token;
  });

  describe('GET: /v1/users', (done) => {
    it('should return an error if user token header is missing', (done) => {
      chai.request(server)
        .get('/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Request has no user token header.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });

  describe('GET: /v1/users', (done) => {
    it('should return an error if user token header is malformed', (done) => {
      chai.request(server)
        .get('/v1/users')
        .set('x-teams-user-token', 'xxx')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('jwt malformed');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });

  describe('GET: /v1/users', (done) => {
    beforeEach(async () => {
      await models.User.create(mock.user2);
      await models.User.create(mock.user3);
      await models.User.create(mock.user4);
      await models.User.create(mock.user5);
    });
    it('should return an array of existing users', (done) => {
      chai.request(server)
        .get('/v1/users')
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.is.not.empty;
          expect(res.body.data.users.length).to.equal(5);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });

  describe('GET: /v1/users/:userId', (done) => {
    beforeEach(async () => {
      user1 = await models.User.create(mock.user1);
    });
    it('should get a user with the specified ID', (done) => {
      chai.request(server)
        .get(`/v1/users/${user0.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.displayName)
            .to.equal(mock.user0.displayName);
          expect(res.body.data.user.email).to.equal(mock.user0.email);
          expect(res.body.data.user.isYou).to.equal(true);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it(
      'should get a user (different from the logged-in user) ' +
      'with the specified ID',
      (done) => {
        chai.request(server)
          .get(`/v1/users/${user1.id}`)
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            expect(res.body.data).to.be.an('Object');
            res.body.data.should.have.property('user');
            expect(res.body.data.user.id).to.not.be.undefined;
            expect(res.body.data.user.displayName)
              .to.equal(mock.user1.displayName);
            expect(res.body.data.user.email).to.equal(mock.user1.email);
            expect(res.body.data.user.isYou).to.equal(false);
            expect(res.body.errors).to.be.undefined;
            done();
          });
      }
    );
    it('should not get a user given an incorrect ID', (done) => {
      chai.request(server)
        .get('/v1/users/12345678-1234-1234-1234-123456789abc')
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('User with the specified ID does not exist.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });

  describe('DELETE: /v1/users/:userId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .delete('/v1/users/1')
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('This operation is not yet supported.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });

  describe('PUT: /v1/users/:userId', (done) => {
    beforeEach(async () => {
      user1 = await models.User.create(mock.user1);
      mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
      user1.token = mock.user1.token;
    });
    it('should allow an admin user to update their photo', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ photo: 'https://www.myphotos.com/new-photo' })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.photo)
            .to.equal('https://www.myphotos.com/new-photo');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should allow a non-admin user to update their photo', (done) => {
      chai.request(server)
        .put(`/v1/users/${user1.id}`)
        .send({ photo: 'https://www.myphotos.com/new-photo' })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.photo)
            .to.equal('https://www.myphotos.com/new-photo');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should not allow a user to update another user\'s photo [1]', (done) => {
      chai.request(server)
        .put(`/v1/users/${user1.id}`)
        .send({ photo: 'https://www.myphotos.com/new-photo' })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Cannot update another user\'s photo.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not allow a user to update another user\'s photo [2]', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ photo: 'https://www.myphotos.com/new-photo' })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Cannot update another user\'s photo.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should allow an admin user to update their Github username', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ githubUsername: 'user_a' })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.githubUsername)
            .to.equal('user_a');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should allow a non-admin user to update their Github username', (done) => {
      chai.request(server)
        .put(`/v1/users/${user1.id}`)
        .send({ githubUsername: 'user_b' })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.githubUsername)
            .to.equal('user_b');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should not allow a user to update another user\'s Github username [1]', (done) => {
      chai.request(server)
        .put(`/v1/users/${user1.id}`)
        .send({ githubUsername: 'user_c' })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Cannot update another user\'s Github username.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not allow a user to update another user\'s Github username [2]', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ githubUsername: 'user_d' })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Cannot update another user\'s Github username.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should allow an admin user to update their Slack ID', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ slackId: 'abcd1' })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.slackId)
            .to.equal('abcd1');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should allow a non-admin user to update their Slack ID', (done) => {
      chai.request(server)
        .put(`/v1/users/${user1.id}`)
        .send({ slackId: 'abcd2' })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.slackId)
            .to.equal('abcd2');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should not allow a user to update another user\'s Slack ID [1]', (done) => {
      chai.request(server)
        .put(`/v1/users/${user1.id}`)
        .send({ slackId: 'abcd3' })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Cannot update another user\'s Slack ID.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not allow a user to update another user\'s Slack ID [2]', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ slackId: 'abcd4' })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Cannot update another user\'s Slack ID.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not allow a user to block/unblock themselves', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ blocked: true })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('You cannot block or unblock yourself.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it(
      'should not allow a non-admin user to block/unblock a user [1]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user1.id}`)
          .send({ blocked: true })
          .set('x-teams-user-token', mock.user1.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('errors');
            expect(res.body.errors).to.be.an('Array');
            expect(res.body.errors)
              .to
              .include('You need admin privilege to block or unblock a user.');
            expect(res.body.data).to.be.undefined;
            done();
          });
      }
    );
    it(
      'should not allow a non-admin user to block/unblock a user [2]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user0.id}`) // trying to block/unblock another user
          .send({ blocked: true })
          .set('x-teams-user-token', mock.user1.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('errors');
            expect(res.body.errors).to.be.an('Array');
            expect(res.body.errors)
              .to
              .include('You need admin privilege to block or unblock a user.');
            expect(res.body.data).to.be.undefined;
            done();
          });
      }
    );
    it(
      'should allow an admin user to block/unblock another user [1]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user1.id}`)
          .send({ blocked: true })
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            expect(res.body.data).to.be.an('Object');
            res.body.data.should.have.property('user');
            expect(res.body.data.user.id).to.not.be.undefined;
            expect(res.body.data.user.blocked).to.equal(true);
            expect(res.body.errors).to.be.undefined;
            done();
          });
      }
    );
    it(
      'should allow an admin user to block/unblock another user [2]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user1.id}`)
          .send({ blocked: false })
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            expect(res.body.data).to.be.an('Object');
            res.body.data.should.have.property('user');
            expect(res.body.data.user.id).to.not.be.undefined;
            expect(res.body.data.user.blocked).to.equal(false);
            expect(res.body.errors).to.be.undefined;
            done();
          });
      }
    );
    it('should not allow a user to assign roles to themselves', (done) => {
      chai.request(server)
        .put(`/v1/users/${user0.id}`)
        .send({ role: 'member' })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('You cannot assign roles to yourself.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it(
      'should not allow a non-admin user to assign roles to a user [1]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user1.id}`)
          .send({ role: 'admin' })
          .set('x-teams-user-token', mock.user1.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('errors');
            expect(res.body.errors).to.be.an('Array');
            expect(res.body.errors)
              .to
              .include('You need admin privilege to assign roles to a user.');
            expect(res.body.data).to.be.undefined;
            done();
          });
      }
    );
    it(
      'should not allow a non-admin user to assign roles to a user [2]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user0.id}`) // trying to assign role to another user
          .send({ role: 'member' })
          .set('x-teams-user-token', mock.user1.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('errors');
            expect(res.body.errors).to.be.an('Array');
            expect(res.body.errors)
              .to
              .include('You need admin privilege to assign roles to a user.');
            expect(res.body.data).to.be.undefined;
            done();
          });
      }
    );
    it(
      'should allow an admin user to assign roles to another user [1]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user1.id}`)
          .send({ role: 'admin' })
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            expect(res.body.data).to.be.an('Object');
            res.body.data.should.have.property('user');
            expect(res.body.data.user.id).to.not.be.undefined;
            expect(res.body.data.user.role).to.equal('admin');
            expect(res.body.errors).to.be.undefined;
            done();
          });
      }
    );
    it(
      'should allow an admin user to assign roles to another user [2]',
      (done) => {
        chai.request(server)
          .put(`/v1/users/${user1.id}`)
          .send({ role: 'member' })
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            expect(res.body.data).to.be.an('Object');
            res.body.data.should.have.property('user');
            expect(res.body.data.user.id).to.not.be.undefined;
            expect(res.body.data.user.role).to.equal('member');
            expect(res.body.errors).to.be.undefined;
            done();
          });
      }
    );
  });
});
