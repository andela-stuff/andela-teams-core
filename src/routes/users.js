/**
 * @fileOverview users routes
 *
 * @author Franklin Chieze
 *
 * @requires express
 * @requires ../middleware
 * @requires ../controllers/users
 */

import { Router } from 'express';

import { pagination } from '../middleware';
import usersController from '../controllers/users';

const routes = new Router();

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
routes.get('/', pagination, usersController.get);
routes.get('/:userId', usersController.getUserById);
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
routes.post('/', usersController.create);
routes.put('/:userId', usersController.updateUserById);
routes.delete('/:userId', usersController.deleteUserById);

export default routes;
