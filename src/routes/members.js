/**
 * @fileOverview members routes
 *
 * @author Franklin Chieze
 *
 * @requires NPM:express
 * @requires ../controllers/Members
 * @requires ../middleware
 */

import { Router } from 'express';

import Members from '../controllers/Members';
import middleware from '../middleware';

const membersController = new Members();
const routes = new Router();

routes.use(middleware.auth.authenticateUser);

/**
 * @swagger
 * /v1/teams/:teamId/members:
 *   get:
 *     description: Return the memberships for the team with the specified IDs
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: memberships
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/ResponseBody'
 */
routes.get(
  '/:teamId/members',
  middleware.confirmation.confirmTeamById,
  middleware.pagination,
  middleware.search,
  middleware.sort,
  middleware.filter,
  membersController.get
);
// routes.get('/*/members', teamsController.getForAllTeamsAndAllUsers);
// routes.get('/*/members/*', teamsController.getForAllTeamsAndAllUsers);
// routes.get('/*/members/:userId', teamsController.getForAllTeams);
/**
   * @swagger
   * /v1/teams/:teamId/members/:userId:
   *   get:
   *     description: Return the team membership with the specified IDs
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: membership
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.get(
  '/:teamId/members/:userId',
  middleware.confirmation.confirmTeamById,
  middleware.confirmation.confirmUserById,
  membersController.getById
);
/**
   * @swagger
   * /v1/teams/:teamId/members/:userId:
   *   post:
   *     description: Creates a new team membership
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: memberships
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.post(
  '/:teamId/members/:userId',
  middleware.confirmation.confirmTeamById,
  middleware.confirmation.confirmUserById,
  middleware.confirmation.confirmUserIsLeadInTeamById,
  middleware.validation.validateCreateTeamMember,
  membersController.create
);
/** routes.put('/:teamId/members/:memberId', teamsController.updateById);
routes.delete(
  '/:teamId/members/:memberId',
  teamsController.deleteById
); */

export default routes;
