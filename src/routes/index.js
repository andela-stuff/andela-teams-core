import teamsController from '../controllers/teams';

export default (app) => {
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

  app.get('/v1/users', teamsController.getTeams);
  app.get('/v1/users/:userId', teamsController.getTeams);
  app.post('/v1/users', teamsController.getTeams);
  app.put('/v1/users/:userId', teamsController.getTeams);
  app.delete('/v1/users/:userId', teamsController.getTeams);
};
