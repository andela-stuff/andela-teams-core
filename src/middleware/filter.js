/**
 * @fileOverview Filter middleware
 *
 * @author Franklin Chieze
 */

/**
 * @desc This middleware adds filter metadata to the request object
 *
 * @param { object } req request
 * @param { object } res response
 * @param { object } next the next middleware or endpoint
 *
 * @returns { object } next
 */
export default (req, res, next) => {
  req.meta = req.meta || {};
  req.meta.filter = req.meta.filter || {};
  req.meta.filter.where = req.meta.filter.where || {};

  const { query } = req;

  Object.keys(query).forEach((key) => {
    if (key.startsWith('@')) {
      delete query[key];
    }
  });

  req.meta.filter.where = { ...req.meta.filter.where, ...query };

  return next();
};
