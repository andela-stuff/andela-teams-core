/**
 * @fileOverview sort middleware tests
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

describe('Sort Middleware', () => {
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
    it('should sort by default values', (done) => {
      chai.request(server)
        .get('/v1/users')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.data.users[0].displayName)
            .to.equal(mock.user5.displayName);
          expect(res.body.data.users[1].displayName)
            .to.equal(mock.user4.displayName);
          expect(res.body.data.users[2].displayName)
            .to.equal(mock.user3.displayName);
          expect(res.body.data.users[3].displayName)
            .to.equal(mock.user2.displayName);
          expect(res.body.data.users[4].displayName)
            .to.equal(mock.user1.displayName);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should sort by default attribute, ASC order', (done) => {
      chai.request(server)
        .get('/v1/users?@order=ASC')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.data.users[0].displayName)
            .to.equal(mock.user1.displayName);
          expect(res.body.data.users[1].displayName)
            .to.equal(mock.user2.displayName);
          expect(res.body.data.users[2].displayName)
            .to.equal(mock.user3.displayName);
          expect(res.body.data.users[3].displayName)
            .to.equal(mock.user4.displayName);
          expect(res.body.data.users[4].displayName)
            .to.equal(mock.user5.displayName);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should sort by default attribute, DESC order', (done) => {
      chai.request(server)
        .get('/v1/users?@order=DESC')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.data.users[0].displayName)
            .to.equal(mock.user5.displayName);
          expect(res.body.data.users[1].displayName)
            .to.equal(mock.user4.displayName);
          expect(res.body.data.users[2].displayName)
            .to.equal(mock.user3.displayName);
          expect(res.body.data.users[3].displayName)
            .to.equal(mock.user2.displayName);
          expect(res.body.data.users[4].displayName)
            .to.equal(mock.user1.displayName);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should sort by "displayName" attribute, default order', (done) => {
      chai.request(server)
        .get('/v1/users?@sort=displayName')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.data.users[0].displayName)
            .to.equal(mock.user5.displayName);
          expect(res.body.data.users[1].displayName)
            .to.equal(mock.user4.displayName);
          expect(res.body.data.users[2].displayName)
            .to.equal(mock.user3.displayName);
          expect(res.body.data.users[3].displayName)
            .to.equal(mock.user2.displayName);
          expect(res.body.data.users[4].displayName)
            .to.equal(mock.user1.displayName);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should sort by "displayName" attribute, ASC order', (done) => {
      chai.request(server)
        .get('/v1/users?@sort=displayName&@order=ASC')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.data.users[0].displayName)
            .to.equal(mock.user1.displayName);
          expect(res.body.data.users[1].displayName)
            .to.equal(mock.user2.displayName);
          expect(res.body.data.users[2].displayName)
            .to.equal(mock.user3.displayName);
          expect(res.body.data.users[3].displayName)
            .to.equal(mock.user4.displayName);
          expect(res.body.data.users[4].displayName)
            .to.equal(mock.user5.displayName);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should sort by "displayName" attribute, DESC order', (done) => {
      chai.request(server)
        .get('/v1/users?@sort=displayName&@order=DESC')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.data.users[0].displayName)
            .to.equal(mock.user5.displayName);
          expect(res.body.data.users[1].displayName)
            .to.equal(mock.user4.displayName);
          expect(res.body.data.users[2].displayName)
            .to.equal(mock.user3.displayName);
          expect(res.body.data.users[3].displayName)
            .to.equal(mock.user2.displayName);
          expect(res.body.data.users[4].displayName)
            .to.equal(mock.user1.displayName);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });
});
