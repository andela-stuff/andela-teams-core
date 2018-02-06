/**
 * @fileOverview Application's routes
 *
 * @author Franklin Chieze
 *
 * @requires ../middleware
 * @requires ../controllers/teams
 * @requires ../controllers/users
 */

import { pagination } from '../middleware';
import teamsController from '../controllers/teams';
import usersController from '../controllers/users';

export default (app) => {
/**
 * @swagger
 * definitions:
 *   ResponseBody:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *       errors:
 *         type: array
 *       meta:
 *         type: object
 *   Team:
 *     type: object
 *     required:
 *       - name
 *       - userId
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       userId:
 *         type: integer
 *         format: int64
 *   User:
 *     type: Object
 *       - required:
 *         - email
 *         - firstName
 *       - properties:
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 */

/**
 * @swagger
 * /v1/teams:
 *   get:
 *     description: Get all teams
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success!
 */
  app.get('/v1/teams', pagination, teamsController.getTeams);
  app.get('/v1/teams/:teamId', teamsController.getTeamById);
  app.post('/v1/teams', teamsController.create);
  app.put('/v1/teams/:teamId', teamsController.updateTeamById);
  app.delete('/v1/teams/:teamId', teamsController.deleteTeamById);

  app.get(
    '/v1/teams/:teamId/members',
    pagination,
    teamsController.getMemberships
  );
  app.get(
    '/v1/teams/:teamId/members/:memberId',
    teamsController.getMembershipById
  );
  app.post('/v1/teams/:teamId/members', teamsController.createMembership);
  app.put(
    '/v1/teams/:teamId/members/:memberId',
    teamsController.updateMembershipById
  );
  app.delete(
    '/v1/teams/:teamId/members/:memberId',
    teamsController.deleteMembershipById
  );

  /**
   * @swagger
   * /v1/users:
   *   get:
   *     description: Endpoint to get an array of existing users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
  app.get('/v1/users', pagination, usersController.get);
  app.get('/v1/users/:userId', usersController.getUserById);
  /**
   * @swagger
   * /v1/users:
   *   post:
   *     description: Endpoint to create a new user
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
  app.post('/v1/users', usersController.create);
  app.put('/v1/users/:userId', usersController.updateUserById);
  app.delete('/v1/users/:userId', usersController.deleteUserById);
};
