/**
 * @fileoverview Favorites controller tests
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

const { expect } = chai;
chai.use(chaiHttp);

let user = {};
let team;

describe('FavoritesController', () => {
  beforeEach(async () => {
    await models.Favorites.destroy({ where: {} });
    await models.Team.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    user = await models.User.create(mock.user0);
    await models.Team.create({ ...mock.favTeam, userId: user.id });
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
  });

  describe('POST: Favorites', () => {
    it('should add a team to the user\'s favorites', (done) => {
      chai.request(server)
        .post(`/v1/favorites/${mock.favTeam.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal('Success');
          expect(response.body.favoriteTeams).to.be.an('object');
          expect(response.body.favoriteTeams.teamId).to.equal('93c70d82-b5e3-11e8-96f8-529269fb1459');
          done();
        });
    });
    it('should get a user\'s favorite teams', (done) => {
      chai.request(server)
        .get(`/v1/favorites?userId=${user.id}`)
        .set('x-teams-user-token', mock.user0.token)
        .end((err, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal('Success');
          done();
        });
    });
  });
});
