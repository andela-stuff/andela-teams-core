/**
 * @fileOverview Accounts controller tests
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

// team must exist
// only team lead can create accounts
// can't have 2 accounts with the same name in the same team
// account must include certain fields (during creation)

let user0 = {};
let user1 = {};

describe('AccountsController', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {} });
    user0 = await models.User.create(mock.user0);
    mock.user0.token = jwt.sign({ email: mock.user0.email }, config.SECRET);
    user0.token = mock.user0.token;
  });

  describe('POST: /v1/teams/:teamId/accounts', (done) => {
    it('should return an error if user token header is missing', (done) => {
      chai.request(server)
        .get('/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('Request has no user token header.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });
});
