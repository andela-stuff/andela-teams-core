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

let user1 = {};

describe('TeamsController', () => {
  beforeEach(async () => {
    await models.Team.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user1 = await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
    user1.token = mock.user1.token;
  });

  describe('GET: /v1/teams', (done) => {
    beforeEach(async () => {
      await models.Team.create({ ...mock.team1, userId: user1.id });
      await models.Team.create({ ...mock.team2, userId: user1.id });
      await models.Team.create({ ...mock.team3, userId: user1.id });
      await models.Team.create({ ...mock.team4, userId: user1.id });
      await models.Team.create({ ...mock.team5, userId: user1.id });
    });
    it('should return an array of existing teams', (done) => {
      chai.request(server)
        .get('/v1/teams')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teams');
          expect(res.body.data.teams).to.be.an('Array').that.is.not.empty;
          expect(res.body.data.teams.length).to.equal(5);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });
/*
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

  describe('POST: /v1/teams/', (done) => {
    it('should not create a team without a name', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1WithoutName)
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The name field is required.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should create a new team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('team');
          expect(res.body.data.team.id).to.not.be.undefined;
          expect(res.body.data.team.name).to.equal(mock.team1.name);
          expect(res.body.data.team.description)
            .to.equal(mock.team1.description);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should create a new team with default description', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team2WithoutDescription)
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('team');
          expect(res.body.data.team.id).to.not.be.undefined;
          expect(res.body.data.team.name)
            .to.equal(mock.team2WithoutDescription.name);
          expect(res.body.data.team.description)
            .to.equal('There is no description for this team');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });

  describe('POST: /v1/auth/signup', (done) => {
    beforeEach(async () => {
      const user2 = await models.User.create(mock.user2);
      await models.Team.create({ ...mock.team1, userId: user2.id });
    });
    it('should not create a team with an existing name', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Team with the same name already exists.');
          expect(res.body.data).to.be.undefined;
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
*/
});
