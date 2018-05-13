/**
 * @fileOverview Search middleware
 *
 * @author Franklin Chieze
 */

/**
 * @desc This middleware adds search metadata to the request object
 *
 * @param { object } req request
 * @param { object } res response
 * @param { object } next the next middleware or endpoint
 *
 * @returns { object } next
 */
export default (req, res, next) => {
  req.meta = req.meta || {};
  req.meta.search = req.meta.search || {};

  const query = req.query['@search'] || '';

  req.meta.search = { ...req.meta.search, query };

  return next();
};
