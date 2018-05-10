/**
 * @fileOverview auth routes
 *
 * @author Franklin Chieze
 *
 * @requires NPM:express
 * @requires ../controllers/Teams
 * @requires ../middleware
 */

import { Router } from 'express';

import Teams from '../controllers/Teams';
import middleware from '../middleware';

const teamsController = new Teams();
const routes = new Router();

routes.use(middleware.auth.authenticateUser);

routes.get('/', teamsController.get);
routes.get('/:teamId', teamsController.getById);
/**
   * @swagger
   * /v1/teams:
   *   post:
   *     description: Creates a new team
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: teams
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.post('/', middleware.validation.validateCreateTeam, teamsController.create);
routes.put('/:teamId', teamsController.updateById);
routes.delete('/:teamId', teamsController.deleteById);

routes.get('/:teamId/members', teamsController.getMemberships);
routes.get('/:teamId/members/:memberId', teamsController.getMembershipById);
routes.post('/:teamId/members', teamsController.createMembership);
routes.put('/:teamId/members/:memberId', teamsController.updateMembershipById);
routes.delete(
  '/:teamId/members/:memberId',
  teamsController.deleteMembershipById
);

export default routes;
