/**
 * @fileOverview Application's routes
 *
 * @author Franklin Chieze
 *
 * @requires ../middleware
 * @requires ../controllers/teams
 * @requires ./users
 */

import { pagination } from '../middleware';
import teamsController from '../controllers/teams';
import usersRoutes from './users';

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

  app.use('/v1/users', usersRoutes);
};
