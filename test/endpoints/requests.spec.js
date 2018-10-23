/**
 * @fileOverview Tests for /v1/teams
 *
 * @author Jacob Nouwatin
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
let user2 = {};
let request = {};
let request1 = {};
let request2 = {};

describe('Tests for /v1/requests', () => {
  beforeEach(async () => {
    await models.Request.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user0 = await models.User.create(mock.user0);
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
    user0.token = mock.user0.token;
    user1 = await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
    user1.token = mock.user1.token;
    request = await models.Request.create({
      ...mock.adminRequest, userId: user1.id
    });
  });

  describe('GET: /v1/requests', (done) => {
    it('should get all requests', (done) => {
      chai.request(server)
        .get('/v1/requests')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('requests');
          expect(res.body.data.requests).to.be.an('Array')
            .that.is.not.empty;
          expect(res.body.data.requests.length).to.equal(1);
          expect(res.body.data.requests[0].type)
            .to.equal(mock.adminRequest.type);
          done();
        });
    });
  });

  describe('POST: /v1/requests', (done) => {
    it('should not create a request without type', (done) => {
      chai.request(server)
        .post('/v1/requests')
        .send({ ...mock.adminRequestWithoutType, userId: user1.id })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('notNull Violation: Request.type cannot be null');
          done();
        });
    });

    it('should not create a request with numeric data', (done) => {
      chai.request(server)
        .post('/v1/requests')
        .send({ ...mock.adminRequestWithNumericData, userId: user1.id })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The data must be a string.');
          done();
        });
    });

    it('should create a request if the user enters valid type and data', (done) => {
      chai.request(server)
        .post('/v1/requests')
        .send({ ...mock.adminRequest, userId: user0.id })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('request');
          expect(res.body.data.request.type).to.equal(mock.adminRequest.type);
          done();
        });
    });

    it('should not create a request if the user already had a request with the same type', (done) => {
      chai.request(server)
        .post('/v1/requests')
        .send({ ...mock.adminRequest, userId: user1.id })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('You have made a request with the same type.');
          done();
        });
    });
  });

  describe('PUT: /v1/requests', (done) => {
    it('should accept the user\'s requests', (done) => {
      before(async () => {
        user1 = await models.User.create(user1);
        user2 = await models.User.create(user2);
        request1 = await models.Request.create({
          ...mock.adminRequest, userId: user1.id
        });
        request2 = await models.Request.create({
          ...mock.adminRequest, userId: user2.id
        });
      });
      after(async () => {
        await models.Request.destroy({ where: {} });
        await models.User.destroy({ where: {} });
      });
      chai.request(server)
        .put('/v1/requests')
        .send({
          userIds: [user1.id, user2.id],
          requestIds: [request1.id, request2.id]
        })
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('acceptedUsers');
          expect(res.body.data.acceptedUsers.length).to.equal(1);
          expect(res.body.data.acceptedUsers[0].id).to.equal(user1.id);
          done();
        });
    });
  });
});
