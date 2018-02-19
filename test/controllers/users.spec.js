/**
 * @fileOverview Auth controller tests
 *
 * @author Franklin Chieze
 *
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires ../mock
 * @requires ../../build/models
 * @requires ../../build/server
 */

import chai from 'chai';
import chaiHttp from 'chai-http';

import mock from '../mock';
import models from '../../build/models';
import server from '../../build/server';

// test pagination

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

describe('UsersController', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {} });
  });
  describe('GET: /v1/users', (done) => {
    it('should return an empty array if there is no existing user', (done) => {
      chai.request(server)
        .get('/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.is.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });

  describe('GET: /v1/users', (done) => {
    beforeEach(async () => {
      await models.User.create(mock.user1);
    });
    it('should return a non-empty array of existing users', (done) => {
      chai.request(server)
        .get('/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('users');
          expect(res.body.data.users).to.be.an('Array').that.is.not.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });

  describe('GET: /v1/users/:userId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .get('/v1/users/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('DELETE: /v1/users/:userId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .delete('/v1/users/1')
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
    it('should respond with an object', (done) => {
      chai.request(server)
        .put('/v1/users/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });
});
