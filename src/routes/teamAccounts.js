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

routes.get(
  '/:teamId/accounts',
  middleware.check.teamWithParamsIdExists,
  middleware.pagination,
  middleware.search,
  middleware.sort,
  middleware.filter,
  accountsController.get
);

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
