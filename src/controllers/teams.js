export default {
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
  }
};
