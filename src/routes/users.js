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
import { pagination } from '../middleware';

const usersController = new Users();
const routes = new Router();

/**
   * @swagger
   * /v1/users:
   *   get:
   *     description: Return an array of existing users
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
routes.get('/', usersController.get);
routes.get('/:userId', usersController.getById);
routes.put('/:userId', usersController.updateById);
routes.delete('/:userId', usersController.deleteById);

export default routes;
