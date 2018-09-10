/**
 * @fileOverview projects routes
 *
 * @author Seun Agbeye
 *
 * @requires NPM:express
 * @requires ../controllers/Teams
 * @requires ../middleware
 */

import { Router } from 'express';

import Project from '../controllers/Projects';
import middleware from '../middleware';

const projectController = new Project();
const projectRoutes = new Router();
const teamProjectRoutes = new Router();

[
  projectRoutes,
  teamProjectRoutes
].map(routes => routes.use(middleware.auth.authenticateUser));

teamProjectRoutes.get(
  '/:teamId/projects',
  middleware.check.teamWithParamsIdExists,
  middleware.pagination,
  middleware.search,
  middleware.sort,
  middleware.filter,
  projectController.get
);

projectRoutes.get(
  '/:projectId',
  projectController.getProjectById
);

teamProjectRoutes.post(
  '/:teamId/projects',
  middleware.check.teamWithParamsIdExists,
  middleware.check.currentUserIsLeadInTeamWithParamsId,
  middleware.validate.createProject,
  projectController.create
);

projectRoutes.put(
  '/:projectId',
  middleware.check.passTeamIdToReqParam,
  middleware.check.currentUserIsLeadInTeamWithParamsId,
  middleware.validate.updateProject,
  projectController.updateProjectById
);

projectRoutes.delete(
  '/:projectId',
  middleware.check.passTeamIdToReqParam,
  middleware.check.currentUserIsLeadInTeamWithParamsId,
  projectController.deleteProjectById
);

export { projectRoutes, teamProjectRoutes };
