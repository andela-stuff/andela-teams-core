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

const { expect } = chai;
chai.use(chaiHttp);

let user1 = {};
let user = {};

describe('Tests for /v1/requests', () => {
  before(async () => {
    await models.Request.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user1 = await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
    user1.token = mock.user1.token;
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
            .to.include('The type field is required.');
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
        .send({ ...mock.adminRequest, userId: user1.id })
        .set('x-teams-user-token', mock.user1.token)
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
      before(async () => {
        user = await models.User.create(mock.user1);
        mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
        user.token = mock.user1.token;

        await models.Request.create({
          ...mock.adminRequest, userId: user.id
        });
      });
      chai.request(server)
        .post('/v1/requests')
        .send({ ...mock.adminRequest, userId: user.id })
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
});
