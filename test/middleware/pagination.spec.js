/**
 * @fileOverview pagination middleware tests
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

describe('UsersController', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {} });
    await models.User.create(mock.user1);
    mock.user1.token = jwt.sign({ email: mock.user1.email }, config.SECRET);
  });

  describe('GET: /v1/users', (done) => {
    beforeEach(async () => {
      await models.User.create(mock.user2);
      await models.User.create(mock.user3);
      await models.User.create(mock.user4);
      await models.User.create(mock.user5);
    });
    it('should return pagination metadata with default values', (done) => {
      chai.request(server)
        .get('/v1/users')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(20);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(1);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: -1)', (done) => {
      // limit less than 1 is automatically changed to 1
      chai.request(server)
        .get('/v1/users?limit=-1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, offset: -1)', (done) => {
      // offset less than 0 is automatically changed to 0
      chai.request(server)
        .get('/v1/users?limit=1&offset=-1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, offset: 1)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1&offset=1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(1);
          expect(res.body.meta.pagination.page).to.equal(2);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, offset: 2)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1&offset=2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(2);
          expect(res.body.meta.pagination.page).to.equal(3);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, offset: 5)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1&offset=5')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(5);
          expect(res.body.meta.pagination.page).to.equal(6);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.is.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, page: -1)', (done) => {
      // page less than 1 is automatically changed to 1
      chai.request(server)
        .get('/v1/users?limit=1&page=-1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, page: 1)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1&page=1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, page: 2)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1&page=2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(1);
          expect(res.body.meta.pagination.page).to.equal(2);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, page: 5)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1&page=5')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(4);
          expect(res.body.meta.pagination.page).to.equal(5);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 1, page: 10)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=1&page=10')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(1);
          expect(res.body.meta.pagination.offset).to.equal(9);
          expect(res.body.meta.pagination.page).to.equal(10);
          expect(res.body.meta.pagination.pages).to.equal(5);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.is.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(2);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2, offset: 1)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2&offset=1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(1);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(2);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2, offset: 2)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2&offset=2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(2);
          expect(res.body.meta.pagination.page).to.equal(2);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(2);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2, offset: 5)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2&offset=5')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(5);
          expect(res.body.meta.pagination.page).to.equal(3);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.is.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2, page: 1)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2&page=1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(2);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2, page: 2)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2&page=2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(2);
          expect(res.body.meta.pagination.page).to.equal(2);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.not.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(2);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2, page: 3)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2&page=3')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(4);
          expect(res.body.meta.pagination.page).to.equal(3);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(1);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 2, page: 5)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=2&page=5')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(2);
          expect(res.body.meta.pagination.offset).to.equal(8);
          expect(res.body.meta.pagination.page).to.equal(5);
          expect(res.body.meta.pagination.pages).to.equal(3);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.is.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 5)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=5')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(5);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(1);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 5, offset: 1)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=5&offset=1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(5);
          expect(res.body.meta.pagination.offset).to.equal(1);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(1);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(4);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 5, offset: 2)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=5&offset=2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(5);
          expect(res.body.meta.pagination.offset).to.equal(2);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(1);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(3);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 5, offset: 5)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=5&offset=5')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(5);
          expect(res.body.meta.pagination.offset).to.equal(5);
          expect(res.body.meta.pagination.page).to.equal(2);
          expect(res.body.meta.pagination.pages).to.equal(1);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.is.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 5, page: 1)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=5&page=1')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(5);
          expect(res.body.meta.pagination.offset).to.equal(0);
          expect(res.body.meta.pagination.page).to.equal(1);
          expect(res.body.meta.pagination.pages).to.equal(1);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.has.length(5);
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
    it('should return pagination metadata (limit: 5, page: 2)', (done) => {
      chai.request(server)
        .get('/v1/users?limit=5&page=2')
        .set('x-teams-user-token', mock.user1.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('meta');
          expect(res.body.meta).to.be.an('Object');
          res.body.meta.should.have.property('pagination');
          expect(res.body.meta.pagination).to.be.an('Object');
          expect(res.body.meta.pagination.limit).to.equal(5);
          expect(res.body.meta.pagination.offset).to.equal(5);
          expect(res.body.meta.pagination.page).to.equal(2);
          expect(res.body.meta.pagination.pages).to.equal(1);
          expect(res.body.meta.pagination.pageSize)
            .to.equal(res.body.meta.pagination.limit);
          expect(res.body.meta.pagination.total).to.equal(5);
          expect(res.body.meta.pagination.next).to.be.undefined;
          expect(res.body.meta.pagination.previous).to.not.be.undefined;
          expect(res.body.data.users).to.be.an('Array').that.is.empty;
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });
});
