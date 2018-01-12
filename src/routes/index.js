import teamsController from '../controllers/teams';

export default (app) => {
  app.get('/v1/teams', teamsController.getTeams);
};
