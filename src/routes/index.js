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

import accountMembersRoutes from './accountMembers';
import authRoutes from './auth';
import teamsRoutes from './teams';
import teamAccountsRoutes from './teamAccounts';
import teamMembersRoutes from './teamMembers';
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
  app.use('/v1/accounts', accountMembersRoutes);

  app.use('/v1/auth', authRoutes);

  app.use('/v1/teams', teamsRoutes);

  app.use('/v1/teams', teamAccountsRoutes);

  app.use('/v1/teams', teamMembersRoutes);

  app.use('/v1/users', usersRoutes);
};
