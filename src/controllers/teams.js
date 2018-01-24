import models from '../models';

export default {
  /**
   * @method createTeam
   * @desc This method creates a new team
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  createTeam(req, res) {
    return res.status(200).send({
      data: { name: 'team1' }
    });
  },
  /**
   * @method deleteTeamById
   * @desc This method deletes the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  deleteTeamById(req, res) {
    return res.status(200).send({
      data: { name: 'team1' }
    });
  },
  /**
   * @method getTeamById
   * @desc This method get the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  getTeamById(req, res) {
    return res.status(200).send({
      data: { name: 'team1' }
    });
  },
  /**
   * @method getTeams
   * @desc This method gets an array of teams
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  getTeams(req, res) {
    return res.status(200).send({
      data: [{ name: 'team1' }, { name: 'team2' }]
    });
  },
  /**
   * @method updateTeamById
   * @desc This method updates the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  updateTeamById(req, res) {
    return res.status(200).send({
      data: { name: 'team1' }
    });
  },

  /**
   * @method createMembership
   * @desc This method creates a new membership
   * in the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  createMembership(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
  },
  /**
   * @method deleteMembershipById
   * @desc This method deletes the membership with the specified member ID
   * from the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  deleteMembershipById(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
  },
  /**
   * @method getMembershipById
   * @desc This method gets the team membership with the specified member ID
   * from the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  getMembershipById(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
  },
  /**
   * @method getMemberships
   * @desc This method gets an array of all memberships
   * from the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  getMemberships(req, res) {
    return res.status(200).send({
      data: [
        { teamId: 1, userId: 1, role: 'LF' },
        { teamId: 2, userId: 2, role: 'PO' }
      ]
    });
  },
  /**
   * @method updateMembershipById
   * @desc This method updates the membership with the specified member ID
   * in the team with the specified team ID
   * @param { object} req request
   * @param { object} res response
   * @returns { object } response
   */
  updateMembershipById(req, res) {
    return res.status(200).send({
      data: { teamId: 1, userId: 1, role: 'LF' }
    });
  }
};
