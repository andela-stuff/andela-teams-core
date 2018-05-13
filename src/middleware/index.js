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
import Confirmation from './Confirmation';
import pagination from './pagination';
import sort from './sort';
import Validation from './Validation';

const auth = new Auth();
const confirmation = new Confirmation();
const validation = new Validation();

export default {
  api,
  auth,
  confirmation,
  pagination,
  sort,
  validation
};
