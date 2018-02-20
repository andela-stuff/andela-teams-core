/**
 * @fileOverview Teams controller tests
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

describe('TeamsController', () => {
  beforeEach(async () => {
    await models.Team.destroy({ where: {} });
    await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
  });

  describe('GET: /v1/teams', (done) => {
    it('should respond with an array', (done) => {
      chai.request(server)
        .get('/v1/teams')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Array');
          done();
        });
    });
  });

  describe('GET: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .get('/v1/teams/1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('DELETE: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .delete('/v1/teams/1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('POST: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send({})
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('PUT: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .put('/v1/teams/1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('GET: /v1/teams/:teamId/members', (done) => {
    it('should respond with an array', (done) => {
      chai.request(server)
        .get('/v1/teams/1/members')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Array');
          done();
        });
    });
  });

  describe('GET: /v1/teams/:teamId/members/:memberId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .get('/v1/teams/1/members/1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });

  describe('DELETE: /v1/teams/:teamId/members/:memberId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .delete('/v1/teams/1/members/1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });

  describe('POST: /v1/teams/:teamId/members', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .post('/v1/teams/1/members')
        .send({})
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });

  describe('PUT: /v1/teams/:teamId/members/:memberId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .put('/v1/teams/1/members/1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });
});
