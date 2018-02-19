/**
 * @fileOverview helper functions
 *
 * @author Franklin Chieze
 */

/**
 * @method generatePaginationMeta
 * @desc Return pagination meta
 *
 * @param { string } endpoint the endpoint
 * @param { Array } dbResult the query results from the database
 * @param {number} limit the number of items on a page
 * @param {number} offset the number of items to be skipped from the
 * beginning of the array of database results
 *
 * @returns { object } the output user object
 */
function generatePaginationMeta(endpoint, dbResult, limit = 20, offset = 0) {
  limit = Number(limit) || 20;
  offset = Number(offset) || 0;

  // limit cannot be less than 1
  if (limit < 1) {
    limit = 1;
  }

  const paginationMeta = {
    limit,
    offset,
    page: Math.floor(offset / limit) + 1, // current page
    pages: Math.ceil(dbResult.count / limit), // total number of pages
    pageSize: limit, // number of items per page
    total: dbResult.count // total number of items
  };

  // calculate next
  const nextOffset = offset + limit;
  if (nextOffset < dbResult.count) {
    paginationMeta.next = `${endpoint}?limit=${limit}&offset=${nextOffset}`;
  }
  // calculate previous
  const prevOffset = offset - limit;
  if (prevOffset > -1) {
    paginationMeta.previous = `${endpoint}?limit=${limit}&offset=${prevOffset}`;
  }

  return paginationMeta;
}

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
    generatePaginationMeta,
    updateUserAttributes
  }
};
