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

// routes.get('/:teamId/members', teamsController.getMemberships);
// routes.get('/:teamId/members/:memberId', teamsController.getMembershipById);
/**
   * @swagger
   * /v1/teams/:teamId/members:
   *   post:
   *     description: Creates a new team member
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: members
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.post(
  '/:teamId/members/:userId',
  middleware.confirmation.confirmTeamById,
  middleware.confirmation.confirmUserById,
  middleware.validation.validateCreateTeamMember,
  membersController.create
);
/** routes.put('/:teamId/members/:memberId', teamsController.updateMembershipById);
routes.delete(
  '/:teamId/members/:memberId',
  teamsController.deleteMembershipById
); */

export default routes;
