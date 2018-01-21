import teamsController from '../controllers/teams';
import usersController from '../controllers/users';

export default (app) => {
/**
 * @swagger
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */
/**
 * @swagger
 * /v1/teams:
 *   get:
 *     description: Get all teams
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success!
 */
  app.get('/v1/teams', teamsController.getTeams);
  app.get('/v1/teams/:teamId', teamsController.getTeamById);
  app.post('/v1/teams', teamsController.createTeam);
  app.put('/v1/teams/:teamId', teamsController.updateTeamById);
  app.delete('/v1/teams/:teamId', teamsController.deleteTeamById);

  app.get('/v1/teams/:teamId/members', teamsController.getMemberships);
  app.get(
    '/v1/teams/:teamId/members/:memberId',
    teamsController.getMembershipById
  );
  app.post('/v1/teams/:teamId/members', teamsController.createMembership);
  app.put(
    '/v1/teams/:teamId/members/:memberId',
    teamsController.updateMembershipById
  );
  app.delete(
    '/v1/teams/:teamId/members/:memberId',
    teamsController.deleteMembershipById
  );

  app.get('/v1/users', usersController.getUsers);
  app.get('/v1/users/:userId', usersController.getUserById);
  app.post('/v1/users', usersController.createUser);
  app.put('/v1/users/:userId', usersController.updateUserById);
  app.delete('/v1/users/:userId', usersController.deleteUserById);
};
