/* eslint no-unused-expressions:0 */
/**
 * @fileOverview Tests for /v1/teams/:teamId/accounts
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

describe('Tests for /v1/teams/:teamId/accounts', () => {
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
  });

  describe('GET: /v1/teams/:teamId/accounts', (done) => {
    it(
      'should not get a team account with invalid team ID',
      (done) => {
        const teamId = '7a2a5d4e-80b4-411a-8d79-0759b6ab06b0';
        chai.request(server)
          .get(`/v1/teams/${teamId}/accounts`)
          .set('x-teams-user-token', mock.user0.token)
          .end((err2, res) => {
            res.should.have.status(200);
            expect(res.body.errors)
              .to.include('Team with the specified ID does not exist.');
            expect(res.body.data).to.be.undefined;

            done();
          });
      }
    );
    it('should get all team accounts', (done) => {
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
            .end((err, res2) => {
              // Get team accounts
              chai.request(server)
                .get(`/v1/teams/${team1.id}/accounts`)
                .set('x-teams-user-token', mock.user0.token)
                .end((err, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('accounts');
                  expect(res3.body.data.accounts.length).to.equal(1);
                  expect(res3.body.data.accounts[0].id).to.not.be.undefined;
                  expect(res3.body.data.accounts[0].teamId).to.equal(team1.id);
                  expect(res3.body.data.accounts[0].url).to.not.be.undefined;
                  expect(res3.body.errors).to.be.undefined;
                  done();
                });
            });
        });
    });
  });

  describe('POST: /v1/teams/:teamId/accounts', (done) => {
    it('should not add an account to a team that does not exist', (done) => {
      chai.request(server)
        .post(`/v1/teams/${user0.id}/accounts`)
        .send(mock.account1)
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
    it('should not add an account without a name to a team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts`)
            .send(mock.account1WithoutName)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.have.property('errors');
              expect(res2.body.errors).to.be.an('Array');
              expect(res2.body.errors)
                .to.include('The name field is required.');
              expect(res2.body.data).to.be.undefined;

              done();
            });
        });
    });
    it('should allow only team lead to add accounts to the team', (done) => {
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
              res2.should.have.status(200);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('account');
              expect(res2.body.data.account.id).to.not.be.undefined;
              expect(res2.body.data.account.teamId).to.equal(team1.id);
              expect(res2.body.data.account.url).to.not.be.undefined;
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should allow only team lead to add accounts to team [2]', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          // user1 is not a member of team1
          // so user1 should not be able to add accounts to team1
          chai.request(server)
            .post(`/v1/teams/${team1.id}/accounts`)
            .send(mock.account1)
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
    it('should allow only team lead to add accounts to team [3]', (done) => {
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
              // so user1 should not be able to add accounts to team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/accounts`)
                .send(mock.account1)
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
    it('should allow only team lead to add accounts to team [4]', (done) => {
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
              // so user1 should be able to add accounts to team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/accounts`)
                .send(mock.account1)
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('account');
                  expect(res3.body.data.account.id).to.not.be.undefined;
                  expect(res3.body.data.account.teamId).to.equal(team1.id);
                  expect(res3.body.data.account.url).to.not.be.undefined;
                  expect(res3.body.errors).to.be.undefined;

                  done();
                });
            });
        });
    });
    it(
      'should allow only team lead to add (github_repo) accounts to the team',
      (done) => {
        chai.request(server)
          .post('/v1/teams')
          .send(mock.team1)
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            team1 = res.body.data.team;

            chai.request(server)
              .post(`/v1/teams/${team1.id}/accounts`)
              .send(mock.accountTypeGithubRepo1)
              .set('x-teams-user-token', mock.user0.token)
              .end((err2, res2) => {
                res2.should.have.status(200);
                res2.body.should.have.property('data');
                expect(res2.body.data).to.be.an('Object');
                res2.body.data.should.have.property('account');
                expect(res2.body.data.account.id).to.not.be.undefined;
                expect(res2.body.data.account.teamId).to.equal(team1.id);
                expect(res2.body.data.account.type).to.equal('github_repo');
                expect(res2.body.data.account.url).to.not.be.undefined;
                expect(res2.body.errors).to.be.undefined;

                done();
              });
          });
      }
    );
    it(
      'should allow only team lead to add (pivotal tracker) accounts to the team',
      (done) => {
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
                res2.should.have.status(200);
                res2.body.should.have.property('data');
                expect(res2.body.data).to.be.an('Object');
                res2.body.data.should.have.property('account');
                expect(res2.body.data.account.id).to.not.be.undefined;
                expect(res2.body.data.account.teamId).to.equal(team1.id);
                expect(res2.body.data.account.type).to.equal('pt_project');
                expect(res2.body.data.account.url).to.not.be.undefined;
                expect(res2.body.errors).to.be.undefined;

                done();
              });
          });
      }
    );
    it(
      'should add accounts with default type of "slack_channel" to the team',
      (done) => {
        chai.request(server)
          .post('/v1/teams')
          .send(mock.team1)
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            team1 = res.body.data.team;

            chai.request(server)
              .post(`/v1/teams/${team1.id}/accounts`)
              .send(mock.account1WithoutType)
              .set('x-teams-user-token', mock.user0.token)
              .end((err2, res2) => {
                res2.should.have.status(200);
                res2.body.should.have.property('data');
                expect(res2.body.data).to.be.an('Object');
                res2.body.data.should.have.property('account');
                expect(res2.body.data.account.id).to.not.be.undefined;
                expect(res2.body.data.account.teamId).to.equal(team1.id);
                expect(res2.body.data.account.url).to.not.be.undefined;
                expect(res2.body.data.account.type).to.equal('slack_channel');
                expect(res2.body.errors).to.be.undefined;

                done();
              });
          });
      }
    );
    it(
      'should not add accounts with invalid types to the team',
      (done) => {
        chai.request(server)
          .post('/v1/teams')
          .send(mock.team1)
          .set('x-teams-user-token', mock.user0.token)
          .end((err, res) => {
            team1 = res.body.data.team;

            chai.request(server)
              .post(`/v1/teams/${team1.id}/accounts`)
              .send(mock.account1WithInvalidType)
              .set('x-teams-user-token', mock.user0.token)
              .end((err2, res2) => {
                res2.should.have.status(200);
                res2.body.should.have.property('errors');
                expect(res2.body.errors).to.be.an('Array');
                expect(res2.body.errors)
                  .to
                  .include('The selected type is invalid.');
                expect(res2.body.data).to.be.undefined;

                done();
              });
          });
      }
    );
    it(
      'should not allow more than 1 account with the same name to be added ' +
      'to a team',
      (done) => {
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
                chai.request(server)
                  .post(`/v1/teams/${team1.id}/accounts`)
                  .send(mock.account1)
                  .set('x-teams-user-token', mock.user0.token)
                  .end((err3, res3) => {
                    res3.should.have.status(200);
                    res3.body.should.have.property('errors');
                    expect(res3.body.errors).to.be.an('Array');
                    expect(res3.body.errors)
                      .to
                      .include('Account with the same name already exists in this team.');
                    expect(res3.body.data).to.be.undefined;

                    done();
                  });
              });
          });
      }
    );
  });
});
