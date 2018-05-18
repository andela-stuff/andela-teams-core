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

let team1 = {};
let team2 = {};
let user0 = {};
let user1 = {};

describe('TeamsController', () => {
  beforeEach(async () => {
    await models.Team.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user0 = await models.User.create(mock.user0);
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
    user0.token = mock.user0.token;
    user1 = await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
    user1.token = mock.user1.token;
  });

  describe('GET: /v1/teams', (done) => {
    beforeEach(async () => {
      await models.Team.create({ ...mock.team1, userId: user0.id });
      await models.Team.create({ ...mock.team2, userId: user0.id });
      await models.Team.create({ ...mock.team3, userId: user0.id });
      await models.Team.create({ ...mock.team4, userId: user0.id });
      await models.Team.create({ ...mock.team5, userId: user0.id });
    });
    it('should return an array of existing teams', (done) => {
      chai.request(server)
        .get('/v1/teams')
        .set('x-teams-user-token', mock.user0.token)
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

  describe('GET: /v1/teams/:teamId', (done) => {
    beforeEach(async () => {
      team1 = await models.Team.create({ ...mock.team1, userId: user0.id });
    });
    it('should get a team with the specified ID', (done) => {
      chai.request(server)
        .get(`/v1/teams/${team1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('team');
          expect(res.body.data.team.id).to.not.be.undefined;
          expect(res.body.data.team.name).to.equal(mock.team1.name);
          expect(res.body.data.team.createdByYou).to.equal(true);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it(
      'should get a team with the specified ID created by another user',
      (done) => {
        chai.request(server)
          .get(`/v1/teams/${team1.id}`)
          .set('x-teams-user-token', mock.user1.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            expect(res.body.data).to.be.an('Object');
            res.body.data.should.have.property('team');
            expect(res.body.data.team.id).to.not.be.undefined;
            expect(res.body.data.team.name).to.equal(mock.team1.name);
            expect(res.body.data.team.createdByYou).to.equal(false);
            expect(res.body.errors).to.be.undefined;
            done();
          });
      }
    );
    it('should not get a team given an incorrect ID', (done) => {
      chai.request(server)
        .get(`/v1/teams/${user0.id}`) // deliberately using a user's ID here
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Team with the specified ID does not exist.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should allow members access private teams', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team2)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('team');
          expect(res.body.data.team.id).to.not.be.undefined;
          expect(res.body.data.team.name).to.equal(mock.team2.name);
          expect(res.body.data.team.containsYou).to.equal(true);
          expect(res.body.data.team.createdByYou).to.equal(true);
          expect(res.body.data.team.members).to.equal(1);
          expect(res.body.errors).to.be.undefined;

          team2 = res.body.data.team;

          chai.request(server)
            .get(`/v1/teams/${team2.id}`)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('team');
              expect(res2.body.data.team.id).to.not.be.undefined;
              expect(res2.body.data.team.name).to.equal(mock.team2.name);
              expect(res2.body.data.team.containsYou).to.equal(true);
              expect(res2.body.data.team.createdByYou).to.equal(true);
              expect(res2.body.data.team.members).to.equal(1);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should not allow non-members access private teams', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team2)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('team');
          expect(res.body.data.team.id).to.not.be.undefined;
          expect(res.body.data.team.name).to.equal(mock.team2.name);
          expect(res.body.data.team.containsYou).to.equal(true);
          expect(res.body.data.team.createdByYou).to.equal(true);
          expect(res.body.data.team.members).to.equal(1);
          expect(res.body.errors).to.be.undefined;

          team2 = res.body.data.team;

          chai.request(server)
            .get(`/v1/teams/${team2.id}`)
            .set('x-teams-user-token', mock.user1.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('errors');
              expect(res2.body.errors).to.be.an('Array');
              expect(res2.body.errors)
                .to.include('This team is private.');
              expect(res2.body.data).to.be.undefined;

              done();
            });
        });
    });
  });

  describe('DELETE: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .delete('/v1/teams/1')
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

  describe('POST: /v1/teams/', (done) => {
    it('should not create a team without a name', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send({ ...mock.team1WithoutName, userId: user0.id })
        .set('x-teams-user-token', mock.user0.token)
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
    it('should not create a team by a user that is not an admin', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send({ ...mock.team1, userId: user1.id })
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('This user is not an admin.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should create a new team and auto-add user to team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('team');
          expect(res.body.data.team.id).to.not.be.undefined;
          expect(res.body.data.team.name).to.equal(mock.team1.name);
          expect(res.body.data.team.containsYou).to.equal(true);
          expect(res.body.data.team.createdByYou).to.equal(true);
          expect(res.body.data.team.members).to.equal(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should create a new team with default properties', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team2WithoutOptionalProperties)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('team');
          expect(res.body.data.team.id).to.not.be.undefined;
          expect(res.body.data.team.name)
            .to.equal(mock.team2WithoutOptionalProperties.name);
          expect(res.body.data.team.description)
            .to.equal('There is no description for this team');
          expect(res.body.data.team.private).to.equal(false);
          expect(res.body.data.team.progress).to.equal(0);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });

  describe('POST: /v1/teams', (done) => {
    beforeEach(async () => {
      await models.Team.create({ ...mock.team1, userId: user0.id });
    });
    it('should not create a team with an existing name', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
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
});
