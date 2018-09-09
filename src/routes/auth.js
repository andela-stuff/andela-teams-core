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

routes.post(
  '/signin',
  middleware.validate.signinUser,
  authController.signin
);
routes.post(
  '/signup',
  middleware.validate.signupUser,
  authController.signup
);

export default routes;
