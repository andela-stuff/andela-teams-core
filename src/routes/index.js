/**
 * @fileOverview Application's routes
 *
 * @author Franklin Chieze
 *
 * @requires ./auth
 * @requires ./members
 * @requires ./teams
 * @requires ./teamAccounts
 * @requires ./users
 */

import authRoutes from './auth';
import favoritesRoutes from './favorites';
import teamsRoutes from './teams';
import teamAccountsRoutes from './teamAccounts';
import teamAccountMembersRoutes from './teamAccountMembers';
import teamMembersRoutes from './teamMembers';
import usersRoutes from './users';
import { projectRoutes, teamProjectRoutes } from './projects';

export default (app) => {
  app.use('/v1/auth', authRoutes);

  app.use('/v1/favorites', favoritesRoutes);

  app.use('/v1/teams', teamsRoutes);

  app.use('/v1/teams', teamAccountsRoutes);

  app.use('/v1/teams', teamAccountMembersRoutes);
  app.use('/v1/teams', teamProjectRoutes);
  app.use('/v1/projects', projectRoutes);

  app.use('/v1/teams', teamMembersRoutes);

  app.use('/v1/users', usersRoutes);
};
