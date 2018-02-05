import models from '../models';

export default {
  /**
   * @method createUser
   * @desc This method creates a new user
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  createUser(req, res) {
    return res.status(200).send({
      data: { name: 'user1' }
    });
  },
  /**
   * @method deleteUserById
   * @desc This method deletes the user with the specified user ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  deleteUserById(req, res) {
    return res.status(200).send({
      data: { name: 'user1' }
    });
  },
  /**
   * @method getUserById
   * @desc This method get the user with the specified user ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  getUserById(req, res) {
    return res.status(200).send({
      data: { name: 'user1' }
    });
  },
  /**
   * @method get
   * @desc This method gets an array of users
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  get(req, res) {
    return res.status(200).send({
      data: [{ name: 'user1' }, { name: 'user2' }]
    });
  },
  /**
   * @method updateUserById
   * @desc This method updates the user with the specified user ID
   *
   * @param { object} req request
   * @param { object} res response
   *
   * @returns { object } response
   */
  updateUserById(req, res) {
    return res.status(200).send({
      data: { name: 'user1' }
    });
  }
};
