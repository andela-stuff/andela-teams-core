/**
 * @fileOverview Pagination middleware
 *
 * @author Franklin Chieze
 */

export default (req, res, next) => {
  req.meta = req.meta || {};
  req.meta.pagination = req.meta.pagination || { page: 1 };

  const { page } = req.query;

  if (page) req.meta.pagination.page = Number(page) || 1;

  return next();
};
