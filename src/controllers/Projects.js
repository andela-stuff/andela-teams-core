/**
 * @fileOverview Projectd Controller
 *
 * @author Seun Agbeye
 *
 * @requires ../helpers
 * @requires ../models
 */

import config from '../config';
import helpers from '../helpers';
import models from '../models';

const { Op } = models.Sequelize;

/**
* Controls endpoints for team projects
* @class Projects
*/
export default class Projects {
  /**
   * @method create
   * @desc This method creates a new project
   * for the team with the specified team ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  async create(req, res) {
    const { teamId } = req.params;
    try {
      const project = await models.Project.create({
        ...req.body,
        teamId
      });
      return res.sendSuccess({ project }, 201);
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
     * @method deleteById
     * @desc This method deletes the membership with the specified member ID
     * from the team with the specified team ID
     *
     * @param { object} req request
     * @param { object} res response
     *
     * @returns { object } response
     */
  async deleteProjectById(req, res) {
    const { teamId, projectId } = req.params;
    try {
      const project = await models.Project.getOr404(projectId);
      // await models.Project.validateTeam(project, teamId);
      await project.destroy();

      return res.sendSuccess({});
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
     * @method get
     * @desc This method gets an array of projects
     * from the team with the specified team ID
     *
     * @param { object} req request
     * @param { object} res response
     *
     * @returns { object } response
     */
  async get(req, res) {
    try {
      const { limit, offset } = req.meta.pagination;
      const { query } = req.meta.search;
      const { attribute, order } = req.meta.sort;
      const { where } = req.meta.filter;

      // teamId must be included in the 'where'
      where.teamId = req.params.teamId;

      // this endpoint currently does NOT recognize the '@search' query

      const dbResult = await models.Project.findAndCountAll({ where });
      const projects = await models.Project.findAll({
        where,
        limit,
        offset,
        order: [[attribute, order]],
      });
      if (projects) {
        const pagination = helpers.Misc.generatePaginationMeta(
          req,
          dbResult,
          limit,
          offset
        );

        const updatedProjects = [];
        // using await in loop as shown below
        // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

        // eslint-disable-next-line no-restricted-syntax
        for (const project of projects) {
          // eslint-disable-next-line no-await-in-loop
          const p = await helpers.Misc.updateProjectAttributes(project);
          updatedProjects.push(p);
        }

        return res.sendSuccess(
          { projects: updatedProjects },
          200,
          { pagination }
        );
      }

      throw new Error('Could not retrieve projects from the database.');
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
     * @method getProjectById
     * @desc This method gets the team project with the specified project ID
     * from the team with the specified team ID
     *
     * @param { object} req request
     * @param { object} res response
     *
     * @returns { object } response
     */
  async getProjectById(req, res) {
    const { teamId, projectId } = req.params;
    try {
      const project = await models.Project.getOr404(projectId);
      // await models.Project.validateTeam(project, teamId);
      return res.sendSuccess({ project });
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
   * @method updateProjectById
   * @desc This method updates the project with the specified project ID
   * in the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  async updateProjectById(req, res) {
    const { projectId, teamId } = req.params;
    try {
      const existingProject = await models.Project.getOr404(projectId);
      // await models.Project.validateTeam(existingProject, teamId);
      const project = await existingProject.update(
        req.body,
        { fields: Object.keys(req.body) }
      );
      return res.sendSuccess({ project }, 200);
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
