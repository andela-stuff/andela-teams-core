/**
 * @fileOverview index file for middleware
 *
 * @author Franklin Chieze
 *
 * @requires ./api
 * @requires ./Auth
 * @requires ./pagination
 * @requires ./Validation
 */

import api from './api';
import Auth from './Auth';
import pagination from './pagination';
import Validation from './Validation';

const auth = new Auth();
const validation = new Validation();

export default {
  api,
  auth,
  pagination,
  validation
};
