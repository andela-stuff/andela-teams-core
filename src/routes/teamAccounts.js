/**
 * @fileOverview team accounts routes
 *
 * @author Franklin Chieze
 *
 * @requires NPM:express
 * @requires ../controllers/Accounts
 * @requires ../middleware
 */

import { Router } from 'express';

import Accounts from '../controllers/Accounts';
import middleware from '../middleware';

const accountsController = new Accounts();
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
 *
routes.get(
  '/:teamId/accounts',
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
   *
routes.get(
  '/:teamId/accounts/:userId',
  middleware.check.teamWithParamsIdExists,
  middleware.check.userWithParamsIdExists,
  membersController.getById
);
*/
/**
   * @swagger
   * /v1/teams/:teamId/accounts:
   *   post:
   *     description: Creates a new team account
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: accounts
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.post(
  '/:teamId/accounts',
  middleware.check.teamWithParamsIdExists,
  middleware.check.currentUserIsLeadInTeamWithParamsId,
  middleware.validate.createTeamAccount,
  accountsController.create
);
/** routes.put('/:teamId/accounts/:accountId', accountsController.updateById);
routes.delete(
  '/:teamId/accounts/:accountId',
  accountsController.deleteById
); */

export default routes;
