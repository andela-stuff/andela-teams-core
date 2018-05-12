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

  let limit = req.query['@limit'] ? Number(req.query['@limit']) || 20 : 20;
  // limit cannot be less than 1
  if (limit < 1) {
    limit = 1;
  }

  // there are 2 ways to specify offset
  // 1: by directly specifying offset
  // 2: by specifying page, in which case offset = (page - 1) * limit
  let offset = 0;
  if (req.query['@offset']) {
    offset = Number(req.query['@offset']) || 0;
  } else if (req.query['@page']) {
    let page = Number(req.query['@page']) || 1;
    // page cannot be less than 1
    if (page < 1) {
      page = 1;
    }
    offset = (page - 1) * limit;
  }
  // offset cannot be less than 0
  if (offset < 0) {
    offset = 0;
  }

  req.meta.pagination = { ...req.meta.pagination, limit, offset };

  return next();
};
