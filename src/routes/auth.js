/**
 * @fileOverview auth routes
 *
 * @author Franklin Chieze
 *
 * @requires NPM:express
 * @requires ../controllers/Auth
 * @requires ../middleware
 */

import { Router } from 'express';

import Auth from '../controllers/Auth';
import middleware from '../middleware';

const authController = new Auth();
const routes = new Router();

/**
   * @swagger
   * /v1/auth/signin:
   *   get:
   *     description: Sign in an existing user
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.post(
  '/signin',
  middleware.validation.validateSigninUser,
  authController.signin
);
/**
   * @swagger
   * /v1/auth/signup:
   *   post:
   *     description: Register a new user
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/ResponseBody'
   */
routes.post(
  '/signup',
  middleware.validation.validateSignupUser,
  authController.signup
);

export default routes;
