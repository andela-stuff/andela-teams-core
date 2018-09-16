/**
 * @fileoverview Tests for /v1/favorites
 *
 * @author Ayelegun Kayode Michael
 *
 * @requires NPM:chai
 * @requires NPM:chai-http
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

describe('Tests for /v1/favorites', () => {
  beforeEach(async () => {
    await models.Favorite.destroy({ where: {} });
    await models.Team.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user0 = await models.User.create(mock.user0);
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
    user1 = await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
    team1 = await models.Team.create({ ...mock.team1, userId: user0.id });
    team2 = await models.Team.create({ ...mock.team2, userId: user0.id });
    await models.Favorite.create({ teamId: team1.id, userId: user0.id });
    await models.Favorite.create({ teamId: team2.id, userId: user0.id });
    await models.Favorite.create({ teamId: team2.id, userId: user1.id });
  });

  describe('GET: /v1/favorites', () => {
    it('should get the favorites on a team', (done) => {
      chai.request(server)
        .get(`/v1/favorites?teamId=${team1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorites');
          expect(res.body.data.favorites).to.be.an('Array')
            .that.is.not.empty;
          expect(res.body.data.favorites.length).to.equal(1);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should get the favorites on a team [2]', (done) => {
      chai.request(server)
        .get(`/v1/favorites?teamId=${team2.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorites');
          expect(res.body.data.favorites).to.be.an('Array')
            .that.is.not.empty;
          expect(res.body.data.favorites.length).to.equal(2);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should get the favorites by a user', (done) => {
      chai.request(server)
        .get(`/v1/favorites?userId=${user0.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorites');
          expect(res.body.data.favorites).to.be.an('Array')
            .that.is.not.empty;
          expect(res.body.data.favorites.length).to.equal(2);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should get the favorites by a user [2]', (done) => {
      chai.request(server)
        .get(`/v1/favorites?userId=${user1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorites');
          expect(res.body.data.favorites).to.be.an('Array')
            .that.is.not.empty;
          expect(res.body.data.favorites.length).to.equal(1);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should get the favorite by a user on a team', (done) => {
      chai.request(server)
        .get(`/v1/favorites?userId=${user0.id}&teamId=${team1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorites');
          expect(res.body.data.favorites).to.be.an('Array')
            .that.is.not.empty;
          expect(res.body.data.favorites.length).to.equal(1);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should not get non-existent favorite by a user on a team', (done) => {
      chai.request(server)
        .get(`/v1/favorites?userId=${user1.id}&teamId=${team1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorites');
          expect(res.body.data.favorites).to.be.an('Array').that.is.empty;
          expect(res.body.data.favorites.length).to.equal(0);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should add "favoritedByYou", "favorites", "favoritesUrl" to team', (done) => {
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
          expect(res.body.data.team.favoritedByYou).to.equal(true);
          expect(res.body.data.team.favorites).to.equal(1);
          expect(res.body.data.team.favoritesUrl).to.not.be.undefined;
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should add "favoritedByYou", "favorites", "favoritesUrl" to team [2]', (done) => {
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
          expect(res.body.data.team.favoritedByYou).to.equal(false);
          expect(res.body.data.team.favorites).to.equal(1);
          expect(res.body.data.team.favoritesUrl).to.not.be.undefined;
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should add "favorites", "favoritesUrl" to user', (done) => {
      chai.request(server)
        .get(`/v1/users/${user0.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.displayName)
            .to.equal(mock.user0.displayName);
          expect(res.body.data.user.isYou).to.equal(true);
          expect(res.body.data.user.favorites).to.equal(2);
          expect(res.body.data.user.favoritesUrl).to.not.be.undefined;
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
  });

  describe('DELETE: /v1/favorites', () => {
    it('should delete an existing favorite', (done) => {
      chai.request(server)
        .delete(`/v1/favorites/${team1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object').that.is.empty;
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should not delete a non-existing favorite', (done) => {
      chai.request(server)
        .delete(`/v1/favorites/${team1.id}`)
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('This user has not favorited this team.');
          expect(res.body.data).to.be.undefined;

          done();
        });
    });
  });

  describe('POST: /v1/favorites', () => {
    it('should create a favorite', (done) => {
      chai.request(server)
        .post(`/v1/favorites/${team1.id}`)
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorite');
          expect(res.body.data.favorite.id).to.not.be.undefined;
          expect(res.body.data.favorite.teamId).to.equal(team1.id);
          expect(res.body.data.favorite.userId).to.equal(user1.id);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should not create an existing favorite', (done) => {
      chai.request(server)
        .post(`/v1/favorites/${team1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('This user already favorited this team.');
          expect(res.body.data).to.be.undefined;

          done();
        });
    });
  });

  describe('PUT: /v1/favorites', () => {
    it('should create a favorite', (done) => {
      chai.request(server)
        .put(`/v1/favorites/${team1.id}`)
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('favorite');
          expect(res.body.data.favorite.id).to.not.be.undefined;
          expect(res.body.data.favorite.teamId).to.equal(team1.id);
          expect(res.body.data.favorite.userId).to.equal(user1.id);
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
    it('should not create an existing favorite', (done) => {
      chai.request(server)
        .put(`/v1/favorites/${team1.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object').that.is.empty;
          expect(res.body.errors).to.be.undefined;

          done();
        });
    });
  });
});
