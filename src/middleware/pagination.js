/**
 * @fileOverview Pagination middleware
 *
 * @author Franklin Chieze
 */

/**
 * @desc This middleware adds pagination metadata to the request object
 *
 * @param { object } req request
 * @param { object } res response
 * @param { object } next the next middleware or endpoint
 *
 * @returns { object } next
 */
export default (req, res, next) => {
  req.meta = req.meta || {};
  req.meta.pagination = req.meta.pagination || {};

  const limit = req.query.limit ? Number(req.query.limit) || 20 : 20;

  // there are 2 ways to specify offset
  // 1: by directly specifying offset
  // 2: by specifying page, in which case offset = (page - 1) * limit
  let offset = 0;
  if (req.query.offset) {
    offset = Number(req.query.offset) || 0;
  } else if (req.query.page) {
    let page = Number(req.query.page) || 1;
    // page cannot be less than 1
    if (page < 1) {
      page = 1;
    }
    offset = (page - 1) * limit;
  }

  req.meta.pagination = { ...req.meta.pagination, limit, offset };

  return next();
};
