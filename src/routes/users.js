/**
 * @fileOverview users routes
 *
 * @author Franklin Chieze
 *
 * @requires NPM:express
 * @requires ../controllers/Users
 * @requires ../middleware
 */

import { Router } from 'express';

import Users from '../controllers/Users';
import middleware from '../middleware';

const usersController = new Users();
const routes = new Router();

routes.use(middleware.auth.authenticateUser);

routes.get(
  '/',
  middleware.pagination,
  middleware.search,
  middleware.sort,
  middleware.filter,
  usersController.get
);
routes.get(
  '/:userId',
  middleware.check.userWithParamsIdExists,
  usersController.getById
);
routes.put(
  '/:userId',
  middleware.check.userWithParamsIdExists,
  middleware.validate.updateUser,
  usersController.updateById
);
routes.delete('/:userId', usersController.deleteById);

export default routes;
