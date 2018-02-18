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
  res.sendSuccess = (data, meta, status = 200) =>
    res.status(status).json({
      data,
      meta
    });

  res.sendFailure = (errors, meta, status = 200) =>
    res.status(status).json({
      errors,
      meta
    });

  return next();
};
