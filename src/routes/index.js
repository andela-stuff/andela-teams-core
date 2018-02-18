/**
 * @fileOverview Application's routes
 *
 * @author Franklin Chieze
 *
 * @requires ./auth
 * @requires ./users
 * @requires ../middleware
 * @requires ../controllers/teams
 */

import authRoutes from './auth';
// import usersRoutes from './users';
import { pagination } from '../middleware';
import teamsController from '../controllers/teams';

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
  app.use('/v1/auth', authRoutes);


  // app.use('/v1/users', usersRoutes);
};
