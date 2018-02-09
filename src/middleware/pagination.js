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
  req.meta.pagination = req.meta.pagination || { page: 1, };

  const { page } = req.query;

  if (page) req.meta.pagination.page = Number(page) || 1;

  return next();
};
