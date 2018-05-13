/**
 * @fileOverview Sort middleware
 *
 * @author Franklin Chieze
 */

/**
 * @desc This middleware adds sort metadata to the request object
 *
 * @param { object } req request
 * @param { object } res response
 * @param { object } next the next middleware or endpoint
 *
 * @returns { object } next
 */
export default (req, res, next) => {
  req.meta = req.meta || {};
  req.meta.sort = req.meta.sort || {};

  const attribute = req.query['@sort'] || 'updatedAt';
  const order = req.query['@order'] || 'DESC';

  req.meta.sort = { ...req.meta.sort, attribute, order };

  return next();
};
