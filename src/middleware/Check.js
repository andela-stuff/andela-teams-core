/**
 * @fileOverview Check middleware
 *
 * @author Franklin Chieze
 *
 * @requires ../models
 */

import models from '../models';

/**
* Middleware for checks
* @class Check
*/
export default class Check {
  /**
  * Confirm that an account with the specified ID in the req params exists
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async accountWithParamsIdExists(req, res, next) {
    try {
      const existingAccount = await models.Account.findOne({
        where: { id: req.params.accountId }
      });
      if (!existingAccount) {
        throw new Error('Account with the specified ID does not exist.');
      }

      req.existingAccount = existingAccount;

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that an account with the specified ID in the req params
  * belongs to the team with the specified ID in the req params.
  *
  * This check MUST happen after the checks 'accountWithParamsIdExists' and
  * 'teamWithParamsIdExists'
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async accountWithParamsIdBelongsToTeamWithParamsId(req, res, next) {
    try {
      if (!req.existingTeam) {
        throw new
        Error('Existence of team with the specified ID has not been checked.');
      }
      if (!req.existingAccount) {
        throw new
        Error('Existence of account with the specified ID has not been checked.');
      }

      if (req.existingTeam.id !== req.existingAccount.teamId) {
        throw new
        Error('Account with the specified ID does not belong to team with the specified ID.');
      }

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that the currently authenticated user is an admin
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async currentUserIsAdmin(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw new Error('This user is not an admin.');
      }

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that the currently authenticated user
  * is a team lead of the team with the specified ID in the req params
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async currentUserIsLeadInTeamWithParamsId(req, res, next) {
    try {
      const existingLead = await models.Membership.findOne({
        where: {
          teamId: req.params.teamId,
          userId: req.user.id,
          role: 'lead'
        }
      });
      if (!existingLead) {
        throw new Error('This user is not a team lead in this team.');
      }

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that a team with the specified ID in the req params exists
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async teamWithParamsIdExists(req, res, next) {
    try {
      const existingTeam = await models.Team.findOne({
        where: { id: req.params.teamId }
      });
      if (!existingTeam) {
        throw new Error('Team with the specified ID does not exist.');
      }

      req.existingTeam = existingTeam;

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that a user with the specified ID in the req params exists
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async userWithParamsIdExists(req, res, next) {
    try {
      const existingUser = await models.User.findOne({
        where: { id: req.params.userId }
      });
      if (!existingUser) {
        throw new Error('User with the specified ID does not exist.');
      }

      req.existingUser = existingUser;

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }

  /**
  * Confirm that a user with the specified ID in the req params
  * is a member of the team with the specified ID in the req params.
  *
  * This check MUST happen after the checks 'userWithParamsIdExists' and
  * 'teamWithParamsIdExists'
  * @param {object} req express request object
  * @param {object} res express response object
  * @param {object} next the next middleware or controller
  *
  * @returns {any} the next middleware or controller
  */
  async userWithParamsIdIsMemberOfTeamWithParamsId(req, res, next) {
    try {
      if (!req.existingTeam) {
        throw new
        Error('Existence of team with the specified ID has not been checked.');
      }
      if (!req.existingUser) {
        throw new
        Error('Existence of user with the specified ID has not been checked.');
      }

      const existingMember = await models.Membership.findOne({
        where: { teamId: req.params.teamId, userId: req.params.userId }
      });
      if (!existingMember) {
        throw new
        Error('User with the specified ID is not a member of team with the specified ID.');
      }

      req.existingMember = existingMember;

      next();
    } catch (error) {
      return res.sendFailure([error.message]);
    }
  }
}
