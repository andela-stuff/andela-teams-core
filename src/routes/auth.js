/**
 * @fileOverview auth routes
 *
 * @author Franklin Chieze
 *
 * @requires express
 * @requires ../controllers/users
 */

import { Router } from 'express';

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
routes.post('/signin', usersController.get);
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
routes.post('/signup', usersController.create);

export default routes;
