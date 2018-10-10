/**
 * @fileOverview Projects controller tests
 *
 * @author Seun Agbeye
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

let team1 = { id: '3139603c-cbaf-40a7-9dc0-02b266b58a48' };
let user0 = {};
let user1 = {};
let user2 = {};

describe('ProjectController', () => {
  beforeEach(async () => {
    await models.Project.destroy({ where: {} });
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

  // CREATE TESTS

  describe('POST: /v1/teams/:teamId/projects', (done) => {
    it('should not add a project to a team that does not exist', (done) => {
      chai.request(server)
        .post(`/v1/teams/${team1.id}/projects`)
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
    it('should not add a project without a name to a team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/projects`)
            .send(mock.project1WithoutName)
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
    it('should allow only team lead to add projects to the team', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          chai.request(server)
            .post(`/v1/teams/${team1.id}/projects`)
            .send(mock.project1)
            .set('x-teams-user-token', mock.user0.token)
            .end((err2, res2) => {
              res2.should.have.status(201);
              res2.body.should.have.property('data');
              expect(res2.body.data).to.be.an('Object');
              res2.body.data.should.have.property('project');
              expect(res2.body.data.project.id).to.not.be.undefined;
              expect(res2.body.data.project.teamId).to.equal(team1.id);
              expect(res2.body.data.project.githubRepo).to.not.be.undefined;
              expect(res2.body.data.project.ptProject).to.not.be.undefined;
              expect(res2.body.errors).to.be.undefined;

              done();
            });
        });
    });
    it('should allow only team lead to add projects to team [2]', (done) => {
      chai.request(server)
        .post('/v1/teams')
        .send(mock.team1)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          team1 = res.body.data.team;

          // user1 is not a member of team1
          // so user1 should not be able to add projects to team1
          chai.request(server)
            .post(`/v1/teams/${team1.id}/projects`)
            .send(mock.project1)
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
    it('should allow only team lead to add projects to team [3]', (done) => {
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
              // so user1 should not be able to add projects to team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/projects`)
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
    it('should allow only team lead to add projects to team [4]', (done) => {
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
              // so user1 should be able to add projects to team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/projects`)
                .send(mock.project1)
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  res3.should.have.status(201);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('project');
                  expect(res3.body.data.project.id).to.not.be.undefined;
                  expect(res3.body.data.project.teamId).to.equal(team1.id);
                  expect(res3.body.data.project.githubRepo).to.not.be.undefined;
                  expect(res3.body.data.project.ptProject).to.not.be.undefined;
                  expect(res3.body.errors).to.be.undefined;

                  done();
                });
            });
        });
    });

    // UPDATE TESTS

    it('should allow only team lead to update projects under team', (done) => {
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
              // so user1 should be able to add projects to team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/projects`)
                .send(mock.project1)
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  const { project } = res3.body.data;
                  chai.request(server)
                    .put(`/v1/projects/${project.id}`)
                    .send(mock.project2)
                    .set('x-teams-user-token', mock.user1.token)
                    .end((err4, res4) => {
                      const { project: project2 } = res4.body.data;
                      res4.should.have.status(200);
                      res4.body.should.have.property('data');
                      expect(res4.body.data).to.be.an('Object');
                      res4.body.data.should.have.property('project');
                      expect(project2.id).to.not.be.undefined;
                      expect(project2.teamId).to.equal(team1.id);
                      expect(project2.githubRepo).to.not.be.undefined;
                      expect(project2.ptProject).to.not.be.undefined;
                      expect(res4.body.errors).to.be.undefined;
                      done();
                    });
                });
            });
        });
    });

    it('should allow only team lead to update projects under a team', (done) => {
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
              // so user1 should be able to delete projects from team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/projects`)
                .send(mock.project1)
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  const { project } = res3.body.data;
                  res3.should.have.status(201);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('project');
                  expect(res3.body.data.project.id).to.not.be.undefined;
                  expect(res3.body.data.project.teamId).to.equal(team1.id);
                  expect(res3.body.data.project.githubRepo).to.not.be.undefined;
                  expect(res3.body.data.project.ptProject).to.not.be.undefined;
                  expect(res3.body.errors).to.be.undefined;
                  chai.request(server)
                    .put(`/v1/projects/${project.id}`)
                    .send(mock.project1)
                    .set('x-teams-user-token', mock.user2.token)
                    .end((err4, res4) => {
                      const { errors } = res4.body;
                      expect(errors).to.include('This user is not a team lead in this team.');
                      done();
                    });
                });
            });
        });
    });

    // DELETE TESTS

    it('should allow only team lead to remove projects from team', (done) => {
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
              // so user1 should be able to delete projects from team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/projects`)
                .send(mock.project1)
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  const { project } = res3.body.data;
                  res3.should.have.status(201);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('project');
                  expect(res3.body.data.project.id).to.not.be.undefined;
                  expect(res3.body.data.project.teamId).to.equal(team1.id);
                  expect(res3.body.data.project.githubRepo).to.not.be.undefined;
                  expect(res3.body.data.project.ptProject).to.not.be.undefined;
                  expect(res3.body.errors).to.be.undefined;
                  chai.request(server)
                    .del(`/v1/projects/${project.id}`)
                    .set('x-teams-user-token', mock.user1.token)
                    .end((err4, res4) => {
                      const { data } = res4.body;
                      expect(data).is.empty;
                      done();
                    });
                });
            });
        });
    });

    it('should allow only team lead to remove projects from team', (done) => {
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
              // so user1 should be able to delete projects from team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/projects`)
                .send(mock.project1)
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  const { project } = res3.body.data;
                  res3.should.have.status(201);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('project');
                  expect(res3.body.data.project.id).to.not.be.undefined;
                  expect(res3.body.data.project.teamId).to.equal(team1.id);
                  expect(res3.body.data.project.githubRepo).to.not.be.undefined;
                  expect(res3.body.data.project.ptProject).to.not.be.undefined;
                  expect(res3.body.errors).to.be.undefined;
                  chai.request(server)
                    .del(`/v1/projects/${project.id}`)
                    .set('x-teams-user-token', mock.user2.token)
                    .end((err4, res4) => {
                      const { errors } = res4.body;
                      expect(errors).to.include('This user is not a team lead in this team.');
                      done();
                    });
                });
            });
        });
    });

    // GET A PROJECT TESTS

    it('should get a team with valid id', (done) => {
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
              // so user1 should be able to delete projects from team1
              chai.request(server)
                .post(`/v1/teams/${team1.id}/projects`)
                .send(mock.project1)
                .set('x-teams-user-token', mock.user1.token)
                .end((err3, res3) => {
                  const { project } = res3.body.data;
                  res3.should.have.status(201);
                  res3.body.should.have.property('data');
                  expect(res3.body.data).to.be.an('Object');
                  res3.body.data.should.have.property('project');
                  expect(res3.body.data.project.id).to.not.be.undefined;
                  expect(res3.body.data.project.teamId).to.equal(team1.id);
                  expect(res3.body.data.project.githubRepo).to.not.be.undefined;
                  expect(res3.body.data.project.ptProject).to.not.be.undefined;
                  expect(res3.body.errors).to.be.undefined;
                  chai.request(server)
                    .get(`/v1/projects/${project.id}`)
                    .set('x-teams-user-token', mock.user1.token)
                    .end((err4, res4) => {
                      res4.should.have.status(200);
                      res4.body.should.have.property('data');
                      expect(res4.body.data).to.be.an('Object');
                      res3.body.data.should.have.property('project');
                      expect(res4.body.data.project.id).to.not.be.undefined;
                      expect(res4.body.data.project.teamId).to.equal(team1.id);
                      expect(res4.body.data.project.githubRepo).to.not.be.undefined;
                      expect(res4.body.data.project.ptProject).to.not.be.undefined;
                      expect(res4.body.errors).to.be.undefined;
                      done();
                    });
                });
            });
        });
    });

    it('should fail with invalid uuid', (done) => {
      chai.request(server)
        .get('/v1/projects/404')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.errors).to.not.be.undefined;
          done();
        });
    });

    it('should fail with non existing id', (done) => {
      chai.request(server)
        .get('/v1/projects/3139603c-cbaf-40a7-9dc0-02b266b58a48')
        .set('x-teams-user-token', mock.user1.token)
        .end((err3, res3) => {
          res3.should.have.status(200);
          expect(res3.body.errors).to.includes('Project with the id 3139603c-cbaf-40a7-9dc0-02b266b58a48 not found');
          done();
        });
    });
  });

  // GET PROJECTS UNDER A TEAM

  it('should get a team with valid id', (done) => {
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
            // so user1 should be able to delete projects from team1
            chai.request(server)
              .post(`/v1/teams/${team1.id}/projects`)
              .send(mock.project1)
              .set('x-teams-user-token', mock.user1.token)
              .end((err3, res3) => {
                res3.should.have.status(201);
                res3.body.should.have.property('data');
                expect(res3.body.data).to.be.an('Object');
                res3.body.data.should.have.property('project');
                expect(res3.body.data.project.id).to.not.be.undefined;
                expect(res3.body.data.project.teamId).to.equal(team1.id);
                expect(res3.body.data.project.githubRepo).to.not.be.undefined;
                expect(res3.body.data.project.ptProject).to.not.be.undefined;
                expect(res3.body.errors).to.be.undefined;
                chai.request(server)
                  .get(`/v1/teams/${team1.id}/projects`)
                  .set('x-teams-user-token', mock.user1.token)
                  .end((err4, res4) => {
                    res4.should.have.status(200);
                    res4.body.should.have.property('data');
                    res4.body.should.have.property('meta');
                    expect(res4.body.data).to.be.an('Object');
                    res4.body.data.should.have.property('projects');
                    expect(res4.body.data.projects).to.be.an('Array');
                    expect(res4.body.data.projects[0].id).to.not.be.undefined;
                    expect(res4.body.data.projects[0].teamId).to.equal(team1.id);
                    expect(res4.body.data.projects[0].githubRepo).to.not.be.undefined;
                    expect(res4.body.data.projects[0].ptProject).to.not.be.undefined;
                    expect(res4.body.errors).to.be.undefined;
                    done();
                  });
              });
          });
      });
  });

  it('should fail with non existing id', (done) => {
    chai.request(server)
      .get('/v1/teams/3139603c-cbaf-40a7-9dc0-02b266b58a48/projects')
      .set('x-teams-user-token', mock.user1.token)
      .end((err3, res3) => {
        res3.should.have.status(200);
        expect(res3.body.errors).to.includes('Team with the specified ID does not exist.');
        done();
      });
  });
});
