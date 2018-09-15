/**
 * @fileOverview Application's routes
 *
 * @author Franklin Chieze
 *
 * @requires ./accounts
 * @requires ./auth
 * @requires ./members
 * @requires ./teams
 * @requires ./users
 */

import accountsRoutes from './accounts';
import authRoutes from './auth';
import favoritesRoutes from './favorites';
import teamsRoutes from './teams';
import teamMembersRoutes from './members';
import usersRoutes from './users';

/**
 * @swagger
 * definitions:
 *   ResponseBody:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *       errors:
 *         type: array
 *       meta:
 *         type: object
 *   Team:
 *     type: object
 *     required:
 *       - name
 *       - userId
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       userId:
 *         type: integer
 *         format: int64
 *   User:
 *     type: Object
 *       - required:
 *         - email
 *         - firstName
 *       - properties:
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 */

export default (app) => {
  app.use('/v1/teams', accountsRoutes);

  app.use('/v1/auth', authRoutes);

  app.use('/v1/teams', teamsRoutes);

  app.use('/v1/teams', teamMembersRoutes);

  app.use('/v1/users', usersRoutes);

  app.use('/v1/favorites', favoritesRoutes);
};
