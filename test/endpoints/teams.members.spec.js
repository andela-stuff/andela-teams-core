/**
 * @fileOverview Tests for /v1/teams/:teamId/members
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

let team1 = {};
let user0 = {};
let user1 = {};
let user2 = {};

describe('Tests for /v1/teams/:teamId/members', () => {
  beforeEach(async () => {
    await models.Membership.destroy({ where: {} });
    await models.Team.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user0 = await models.User.create(mock.user0);
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
    user0.token = mock.user0.token;
    user1 = await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
    user1.token = mock.user1.token;
    user2 = await models.User.create(mock.user2);
    mock.user2.token = jwt.sign({ email: mock.user2.email }, config.SECRET);
    user2.token = mock.user2.token;
  });

  describe('GET: /v1/teams/:teamId/members', (done) => {
    it('should get the memberships of team with specified team ID', (done) => {
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
          expect(res.body.data.team.membersUrl).to.not.be.undefined;
          expect(res.body.errors).to.be.undefined;

          team1 = res.body.data.team;

          chai.request(server)
            .get(`/v1/teams/${team1.id}/members`)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('memberships');
              expect(res2.body.data.memberships).to.be.an('Array')
                .that.is.not.empty;
              expect(res2.body.data.memberships.length).to.equal(1);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
  });

  describe('GET: /v1/teams/:teamId/members/:userId', (done) => {
    it('should get the membership with the specified IDs', (done) => {
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
          expect(res.body.data.team.membersUrl).to.not.be.undefined;
          expect(res.body.errors).to.be.undefined;

          team1 = res.body.data.team;

          chai.request(server)
            .get(`/v1/teams/${team1.id}/members/${user0.id}`)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('membership');
              expect(res2.body.data.membership.id).to.not.be.undefined;
              expect(res2.body.data.membership.role).to.equal('lead');
              expect(res2.body.data.membership.teamId).to.equal(team1.id);
              expect(res2.body.data.membership.userId).to.equal(user0.id);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should add user that creates team to team as team lead', (done) => {
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
          expect(res.body.data.team.membersUrl).to.not.be.undefined;
          expect(res.body.errors).to.be.undefined;

          team1 = res.body.data.team;

          chai.request(server)
            .get(`/v1/teams/${team1.id}/members/${user1.id}`)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('errors');
              expect(res2.body.errors).to.be.an('Array');
              expect(res2.body.errors)
                .to
                .include('Membership with the specified IDs does not exist.');
              expect(res2.body.data).to.be.undefined;

              done();
            });
        });
    });
  });

  describe('POST: /v1/teams/:teamId/members/:userId', (done) => {
    it('should add user that creates team to team as team lead', (done) => {
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
          expect(res.body.data.team.membersUrl).to.not.be.undefined;
          expect(res.body.errors).to.be.undefined;

          team1 = res.body.data.team;

          chai.request(server)
            .get(`/v1/teams/${team1.id}/members/${user0.id}`)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('membership');
              expect(res2.body.data.membership.id).to.not.be.undefined;
              expect(res2.body.data.membership.role).to.equal('lead');
              expect(res2.body.data.membership.teamId).to.equal(team1.id);
              expect(res2.body.data.membership.userId).to.equal(user0.id);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should not add a user to a team that does not exist', (done) => {
      chai.request(server)
        .post(`/v1/teams/${team1.id}/members/${user1.id}`)
        .send({})
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
    it('should not add a user that does not exist to a team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          // deliberately use 'team1.id' as user ID
          // so that we get a valid UUID which is not the ID of an existing user
          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${team1.id}`)
            .send({})
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('errors');
              expect(res2.body.errors).to.be.an('Array');
              expect(res2.body.errors)
                .to.include('User with the specified ID does not exist.');
              expect(res2.body.data).to.be.undefined;

              done();
            });
        });
    });
    it('should allow only team lead to add members to the team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({})
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('membership');
              expect(res2.body.data.membership.id).to.not.be.undefined;
              expect(res2.body.data.membership.role).to.equal('member');
              expect(res2.body.data.membership.teamId).to.equal(team1.id);
              expect(res2.body.data.membership.userId).to.equal(user1.id);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should allow only team lead to add members to the team [2]', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          // user1 is not a member of team1
          // so user1 should not be able to add members to team1
          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({})
            .set('x-teams-user-token', mock.user1.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('errors');
              expect(res2.body.errors).to.be.an('Array');
              expect(res2.body.errors)
                .to.include('This user is not a team lead in this team.');
              expect(res2.body.data).to.be.undefined;

              done();
            });
        });
    });
    it('should allow only team lead to add members to the team [3]', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({})
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              // user1 is a member of team1 but not a team lead
              // so user1 should not be able to add members to team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/members/${user1.id}`)
                .send({})
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('errors');
                  expect(res3.body.errors).to.be.an('Array');
                  expect(res3.body.errors)
                    .to.include('This user is not a team lead in this team.');
                  expect(res3.body.data).to.be.undefined;

                  done();
                });
            });
        });
    });
    it('should allow only team lead to add members to the team [4]', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({ role: 'lead' })
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              // user1 is a member of team1 and a team lead
              // so user1 should be able to add members to team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/members/${user2.id}`)
                .send({})
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('membership');
                  expect(res3.body.data.membership.id).to.not.be.undefined;
                  expect(res3.body.data.membership.role).to.equal('member');
                  expect(res3.body.data.membership.teamId).to.equal(team1.id);
                  expect(res3.body.data.membership.userId).to.equal(user2.id);
                  expect(res3.body.errors).to.be.undefined;

                  done();
                });
            });
        });
    });
    it('should not allow user to be added more than once to a team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user0.id}`)
            .send({})
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('errors');
              expect(res2.body.errors).to.be.an('Array');
              expect(res2.body.errors)
                .to.include('This user already exists in this team.');
              expect(res2.body.data).to.be.undefined;

              done();
            });
        });
    });
    it('should add a user to a team as "member" by default', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({})
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('membership');
              expect(res2.body.data.membership.id).to.not.be.undefined;
              expect(res2.body.data.membership.role).to.equal('member');
              expect(res2.body.data.membership.teamId).to.equal(team1.id);
              expect(res2.body.data.membership.userId).to.equal(user1.id);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should add a user to a team in the role specified', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({ role: 'developer' })
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('membership');
              expect(res2.body.data.membership.id).to.not.be.undefined;
              expect(res2.body.data.membership.role).to.equal('developer');
              expect(res2.body.data.membership.teamId).to.equal(team1.id);
              expect(res2.body.data.membership.userId).to.equal(user1.id);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should add a user to a team in the role specified [2]', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({ role: 'lead' })
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('membership');
              expect(res2.body.data.membership.id).to.not.be.undefined;
              expect(res2.body.data.membership.role).to.equal('lead');
              expect(res2.body.data.membership.teamId).to.equal(team1.id);
              expect(res2.body.data.membership.userId).to.equal(user1.id);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should add a user to a team in the role specified [3]', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/members/${user1.id}`)
            .send({ role: 'member' })
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('membership');
              expect(res2.body.data.membership.id).to.not.be.undefined;
              expect(res2.body.data.membership.role).to.equal('member');
              expect(res2.body.data.membership.teamId).to.equal(team1.id);
              expect(res2.body.data.membership.userId).to.equal(user1.id);
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
  });
});
