/**
 * @fileOverview helper functions
 *
 * @author Franklin Chieze
 *
 * @requires NODE:querystring
 * @requires NODE:url
 * @requires ../models
 */

import querystring from 'querystring';
import url from 'url';

import models from '../models';

/**
 * @method generatePaginationMeta
 * @desc Return pagination meta
 *
 * @param { object } req the request object
 * @param { Array } dbResult the query results from the database
 * @param {number} limit the number of items on a page
 * @param {number} offset the number of items to be skipped from the
 * beginning of the array of database results
 *
 * @returns { object } the output user object
 */
function generatePaginationMeta(req, dbResult, limit = 20, offset = 0) {
  limit = Number(limit) || 20;
  offset = Number(offset) || 0;

  // limit cannot be less than 1
  if (limit < 1) {
    limit = 1;
  }
  // offset cannot be less than 0
  if (offset < 0) {
    offset = 0;
  }

  const protocol =
  (req.secure || req.connection.encrypted) ? 'https:' : 'http:';
  const urlObject = url.parse(req.fullUrl);
  const endpointWithoutSearch =
  `${protocol}//${urlObject.host}${urlObject.pathname}`;
  const query = querystring.parse(urlObject.query || '');

  const paginationMeta = {
    limit,
    offset,
    page: Math.floor(offset / limit) + 1, // current page
    pages: Math.ceil(dbResult.count / limit), // total number of pages
    pageSize: limit, // number of items per page
    total: dbResult.count // total number of items
  };

  // current endpoint
  paginationMeta.current = req.fullUrl;

  // calculate next
  const nextOffset = offset + limit;
  if (nextOffset < dbResult.count) {
    if (query['@page']) {
      query['@page'] = paginationMeta.page + 1;
    } else {
      query['@offset'] = nextOffset;
    }
    paginationMeta.next =
    `${endpointWithoutSearch}?${querystring.stringify(query)}`
      .replace('%40limit=', '@limit=')
      .replace('%40page=', '@page=')
      .replace('%40offset=', '@offset=')
      .replace('%40order=', '@order=')
      .replace('%40search=', '@search=')
      .replace('%40sort=', '@sort=');
  }
  // calculate previous
  const prevOffset = offset - limit;
  if (prevOffset > -1) {
    if (query['@page']) {
      query['@page'] = paginationMeta.page - 1;
    } else {
      query['@offset'] = prevOffset;
    }
    paginationMeta.previous =
    `${endpointWithoutSearch}?${querystring.stringify(query)}`
      .replace('%40limit=', '@limit=')
      .replace('%40page=', '@page=')
      .replace('%40offset=', '@offset=')
      .replace('%40order=', '@order=')
      .replace('%40search=', '@search=')
      .replace('%40sort=', '@sort=');
  }

  return paginationMeta;
}

/**
 * @method updateFavoriteAttributes
 * @desc Return updated favorite details
 *
 * @param { object } favorite the input favorite object
 *
 * @returns { object } the output favorite object
 */
function updateFavoriteAttributes(favorite) {
  favorite = favorite.get();
  return favorite;
}

/**
 * @method updateMembershipAttributes
 * @desc Return updated membership details
 *
 * @param { object } membership the input membership object
 *
 * @returns { object } the output membership object
 */
function updateMembershipAttributes(membership) {
  membership = membership.get();
  return membership;
}
/**
 * @method updateMembershipAttributes
 * @desc Return updated membership details
 *
 * @param { object } membership the input membership object
 *
 * @returns { object } the output membership object
 */
function updateProjectAttributes(membership) {
  membership = membership.get();
  return membership;
}

/**
 * @method updateTeamAttributes
 * @desc Return updated team details
 *
 * @param { object } team the input team object
 * @param { object } req the request object
 *
 * @returns { object } the output team object
 */
async function updateTeamAttributes(team, req) {
  team = team.get();

  // favorites
  const favorites = await models.Favorite.findAndCountAll({
    where: { teamId: team.id }
  });

  const favoritesByYou =
  favorites.rows.filter(favorite => (favorite.userId === req.user.id));
  team.favoritedByYou = favoritesByYou.length > 0;

  team.favorites = favorites.count;

  const protocol =
  (req.secure || req.connection.encrypted) ? 'https:' : 'http:';
  const urlObject = url.parse(req.fullUrl);
  const baseUrl = `${protocol}//${urlObject.host}`;

  team.favoritesUrl = `${baseUrl}/v1/favorites?teamId=${team.id}`;

  // memberships
  const memberships = await models.Membership.findAndCountAll({
    where: { teamId: team.id }
  });

  const membershipsThatContainYou =
  memberships.rows.filter(member => (member.userId === req.user.id));
  team.containsYou = membershipsThatContainYou.length > 0;

  team.createdByYou = (team.userId === req.user.id);

  team.members = memberships.count;

  team.membersUrl = `${baseUrl}/v1/teams/${team.id}/members`;

  return team;
}

/**
 * @method updateUserAttributes
 * @desc Return updated user details
 *
 * @param { object } user the input user object
 * @param { object } req the request object
 *
 * @returns { object } the output user object
 */
async function updateUserAttributes(user, req) {
  user = user.get();
  if (req && req.user) {
    user.isYou = (user.id === req.user.id);

    // favorites
    const favorites = await models.Favorite.findAndCountAll({
      where: { userId: user.id }
    });

    user.favorites = favorites.count;

    const protocol =
    (req.secure || req.connection.encrypted) ? 'https:' : 'http:';
    const urlObject = url.parse(req.fullUrl);
    const baseUrl = `${protocol}//${urlObject.host}`;

    user.favoritesUrl = `${baseUrl}/v1/favorites?userId=${user.id}`;

    // memberships
    const memberships = await models.Membership.findAndCountAll({
      where: { userId: user.id }
    });

    user.memberships = memberships.count;

    // user.membershipsUrl = `${baseUrl}/v1/members?userId=${user.id}`;
  }
  delete user.password;

  return user;
}

export default {
  Misc: {
    generatePaginationMeta,
    updateFavoriteAttributes,
    updateMembershipAttributes,
    updateTeamAttributes,
    updateUserAttributes,
    updateProjectAttributes
  }
};
