/**
 * @fileOverview account members routes
 *
 * @author Franklin Chieze
 *
 * @requires NPM:express
 * @requires ../middleware
 */

import { Router } from 'express';

import middleware from '../middleware';

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
  '/:teamId/accounts/:accountId/members',
  middleware.check.teamWithParamsIdExists,
  middleware.pagination,
  middleware.search,
  middleware.sort,
  middleware.filter,
  membersController.get
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
  '/:teamId/accounts/:accountId/members/:userId',
  middleware.check.teamWithParamsIdExists,
  middleware.check.userWithParamsIdExists,
  middleware.check.currentUserIsLeadInTeamWithParamsId,
  middleware.validate.createTeamMember,
  membersController.create
);
/**
routes.delete(
  '/:teamId/accounts/:accountId/members/:userId',
  membersController.deleteById
); */

export default routes;
