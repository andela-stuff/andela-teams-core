/**
 * @fileOverview Tests for /v1/teams/:teamId/accounts/:accountId/members
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
let team2 = {};
let user0 = {};
let user1 = {};

describe('Tests for /v1/teams/:teamId/accounts/:accountId/members', () => {
  beforeEach(async () => {
    await models.Account.destroy({ where: {} });
    await models.Team.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user0 = await models.User.create(mock.user0);
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
    user0.token = mock.user0.token;
    user1 = await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
    user1.token = mock.user1.token;
    team2 = await models.Team.create({ ...mock.team2, userId: user0.id });
  });

  describe('POST: /v1/teams/:teamId/accounts', (done) => {
    it('should not add a user to an account of a team that does not exist', (done) => {
      chai.request(server)
        .post(`/v1/teams/${user0.id}/accounts/${user0.id}/members/${user0.id}`)
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
    it('should not add a user to an account that does not exist', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts/${user0.id}/members/${user0.id}`)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('errors');
              expect(res2.body.errors).to.be.an('Array');
              expect(res2.body.errors)
                .to.include('Account with the specified ID does not exist.');
              expect(res2.body.data).to.be.undefined;

              done();
            });
        });
    });
    it('should not add a user to an account that does not belong to the team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts`)
            .send(mock.account1)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              const accountId = res2.body.data.account.id;

              chai.request(server)
                .post(`/v1/teams/${team2.id}/accounts/${accountId}/members/${user0.id}`)
                .set('x-teams-user-token', mock.user0.token)
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('errors');
                  expect(res3.body.errors).to.be.an('Array');
                  expect(res3.body.errors)
                    .to.include('Account with the specified ID does not belong to team with the specified ID.');
                  expect(res3.body.data).to.be.undefined;

                  done();
                });
            });
        });
    });
    it('should not add a user that does not exist to an account', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts`)
            .send(mock.account2)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              const accountId = res2.body.data.account.id;

              chai.request(server)
                .post(`/v1/teams/${team1.id}/accounts/${accountId}/members/${team1.id}`)
                .set('x-teams-user-token', mock.user0.token)
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('errors');
                  expect(res3.body.errors).to.be.an('Array');
                  expect(res3.body.errors)
                    .to.include('User with the specified ID does not exist.');
                  expect(res3.body.data).to.be.undefined;

                  done();
                });
            });
        });
    });
    it('should not add a user that does not belong to the team to an account of that team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts`)
            .send(mock.account3)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              const accountId = res2.body.data.account.id;

              chai.request(server)
                .post(`/v1/teams/${team1.id}/accounts/${accountId}/members/${user1.id}`)
                .set('x-teams-user-token', mock.user0.token)
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('errors');
                  expect(res3.body.errors).to.be.an('Array');
                  expect(res3.body.errors)
                    .to.include('User with the specified ID is not a member of team with the specified ID.');
                  expect(res3.body.data).to.be.undefined;

                  done();
                });
            });
        });
    });
    it('should not allow a non-lead of a team to add a user to an account of that team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts`)
            .send(mock.account4)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              const accountId = res2.body.data.account.id;

              chai.request(server)
                .post(`/v1/teams/${team1.id}/accounts/${accountId}/members/${user0.id}`)
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
    it('should allow a lead of a team to add a user to an account of that team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts`)
            .send(mock.accountTypePivotalTrackerProject1)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              const accountId = res2.body.data.account.id;

              chai.request(server)
                .post(`/v1/teams/${team1.id}/accounts/${accountId}/members/${user0.id}`)
                .set('x-teams-user-token', mock.user0.token)
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('response');
                  res3.body.data.response.should.have.property('invitedUser');
                  expect(res3.body.data.response.invitedUser.ok).to.not.be.undefined;
                  expect(res3.body.data.response.invitedUser.ok).to.be.a('Boolean');
                  expect(res3.body.errors).to.be.undefined;

                  done();
                });
            });
        });
    });
  });
});
