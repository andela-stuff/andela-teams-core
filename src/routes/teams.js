/**
 * @fileOverview teams routes
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

/**
   * @swagger
   * /v1/teams:
   *   get:
   *     description: Return an array of existing teams
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
routes.get(
  '/',
  middleware.pagination,
  middleware.sort,
  teamsController.get
);
/**
   * @swagger
   * /v1/teams/:teamId:
   *   get:
   *     description: Return the team with the specified ID
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: team
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.get(
  '/:teamId',
  middleware.confirmation.confirmTeamById,
  teamsController.getById
);
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
routes.post(
  '/',
  middleware.confirmation.confirmCurrentUserIsAdmin,
  middleware.validation.validateCreateTeam,
  teamsController.create
);
routes.put('/:teamId', teamsController.updateById);
routes.delete('/:teamId', teamsController.deleteById);

export default routes;
