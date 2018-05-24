/**
 * @fileOverview index file for middleware
 *
 * @author Franklin Chieze
 *
 * @requires ./api
 * @requires ./Auth
 * @requires ./Confirmation
 * @requires ./pagination
 * @requires ./Validation
 */

import api from './api';
import Auth from './Auth';
import Check from './Check';
import filter from './filter';
import pagination from './pagination';
import search from './search';
import sort from './sort';
import Validate from './Validate';

const auth = new Auth();
const check = new Check();
const validate = new Validate();

export default {
  api,
  auth,
  check,
  filter,
  pagination,
  search,
  sort,
  validate
};
