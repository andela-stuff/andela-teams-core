/**
 * @fileOverview filter middleware tests
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

describe('Filter Middleware', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {} });
    await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
  });

  describe('GET: /v1/users', (done) => {
    beforeEach(async () => {
      await models.User.create(mock.user2);
      await models.User.create(mock.user3);
      await models.User.create(mock.user4);
      await models.User.create(mock.user5);
    });
    it('should filter by default values', (done) => {
      chai.request(server)
        .get('/v1/users')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should filter by "displayName" attribute', (done) => {
      chai.request(server)
        .get('/v1/users?displayName=user1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.data.users[0].displayName)
            .to.equal(mock.user1.displayName);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should filter by "displayName" attribute [2]', (done) => {
      chai.request(server)
        .get('/v1/users?displayName=user_that_does_not_exist')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(0);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should filter by "githubUsername" attribute', (done) => {
      chai.request(server)
        .get('/v1/users?githubUsername=user2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.data.users[0].githubUsername)
            .to.equal(mock.user2.githubUsername);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should filter by "githubUsername" attribute [2]', (done) => {
      chai.request(server)
        .get('/v1/users?githubUsername=user_that_does_not_exist')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(0);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });
});
