/**
 * @fileOverview auth routes
 *
 * @author Franklin Chieze
 *
 * @requires NPM:express
 * @requires ../controllers/Auth
 */

import { Router } from 'express';

import Auth from '../controllers/Auth';

const authController = new Auth();
const routes = new Router();

// add middlware to validate sign in and signup, forever

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
routes.post('/signin', authController.signin);
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
routes.post('/signup', authController.signup);

export default routes;
