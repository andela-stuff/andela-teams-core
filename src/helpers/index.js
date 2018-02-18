/**
 * @fileOverview helper functions
 *
 * @author Franklin Chieze
 */

/**
 * @method updateUserAttributes
 * @desc Return updated user details
 *
 * @param { object } user the input user object
 *
 * @returns { object } the output user object
 */
function updateUserAttributes(user) {
  user = user.get();
  delete user.password;
  return user;
}

export default {
  Misc: {
    updateUserAttributes
  }
};
