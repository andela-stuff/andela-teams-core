/**
 * @fileOverview Auth controller tests
 *
 * @author Franklin Chieze
 *
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires NPM:jsonwebtoken
 * @requires ../mock
 * @requires ../../build/config
 * @requires ../../build/models
 * @requires ../../build/server
 */

import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

import mock from '../mock';
import config from '../../build/config';
import models from '../../build/models';
import server from '../../build/server';

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

let user0 = {};
let user1 = {};

describe('UsersController', () => {
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
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('PUT: /v1/users/:userId', (done) => {
    // successful update
    // you cannot update another user's photo
    // you cannot update your own blocked and role
    // you need admin right to update another user's blocked and role
    //
  });
});
