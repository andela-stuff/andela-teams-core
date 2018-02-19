/**
 * @fileOverview API middleware
 *
 * @author Franklin Chieze
 */

/**
 * @desc This middleware adds new methods for sending responses to the
 * response object
 *
 * @param { object } req request
 * @param { object } res response
 * @param { object } next the next middleware or endpoint
 *
 * @returns { object } next
 */
export default (req, res, next) => {
  req.fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  req.fullUrlWithoutSearch = `${req.protocol}://${req.get('host')}${req.path}`;

  res.sendSuccess = (data, status = 200, meta) =>
    res.status(status).json({
      data,
      meta
    });

  res.sendFailure = (errors, status = 200, meta) =>
    res.status(status).json({
      errors,
      meta
    });

  return next();
};
