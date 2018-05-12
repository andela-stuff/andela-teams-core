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

  const protocol = req.secure ? 'https:' : 'http:';
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
    query.offset = nextOffset;
    paginationMeta.next =
    `${endpointWithoutSearch}?${querystring.stringify(query)}`;
  }
  // calculate previous
  const prevOffset = offset - limit;
  if (prevOffset > -1) {
    query.offset = prevOffset;
    paginationMeta.previous =
    `${endpointWithoutSearch}?${querystring.stringify(query)}`;
  }

  return paginationMeta;
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

  const memberships = await models.Membership.findAndCountAll({
    where: { teamId: team.id }
  });

  const membershipsThatContainYou =
  memberships.rows.filter(member => (member.userId === req.user.id));
  team.containsYou = membershipsThatContainYou.length > 0;

  team.createdByYou = (team.userId === req.user.id);

  team.members = memberships.count;

  const protocol = req.secure ? 'https:' : 'http:';
  const urlObject = url.parse(req.fullUrl);
  const baseUrl =
  `${protocol}//${urlObject.host}`;
  team.membersUrl = `${baseUrl}/v1/teams/${team.id}/members`;

  return team;
}

/**
 * @method updateUserAttributes
 * @desc Return updated user details
 *
 * @param { object } user the input user object
 *
 * @returns { object } the output user object
 */
function updateUserAttributes(user) {
  user = user.get();
  return user;
}

export default {
  Misc: {
    generatePaginationMeta,
    updateTeamAttributes,
    updateUserAttributes
  }
};
