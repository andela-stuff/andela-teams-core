/**
 * @fileOverview account members routes
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
  '/:teamId/accounts/:accountId/members',
  middleware.check.teamWithParamsIdExists,
  middleware.pagination,
  middleware.search,
  middleware.sort,
  middleware.filter,
  // membersController.get
);
routes.post(
  '/:teamId/accounts/:accountId/members/:userId',
  middleware.check.teamWithParamsIdExists,
  middleware.check.accountWithParamsIdExists,
  middleware.check.accountWithParamsIdBelongsToTeamWithParamsId,
  middleware.check.userWithParamsIdExists,
  middleware.check.userWithParamsIdIsMemberOfTeamWithParamsId,
  middleware.check.currentUserIsLeadInTeamWithParamsId,
  accountsController.addUser
);
/**
routes.delete(
  '/:teamId/accounts/:accountId/members/:userId',
  membersController.deleteById
); */

export default routes;
