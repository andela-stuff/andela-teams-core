/**
 * @fileOverview index file for middleware
 *
 * @author Franklin Chieze
 *
 * @requires ./api
 * @requires ./Auth
 * @requires ./Validation
 */

import api from './api';
import Auth from './Auth';
import Validation from './Validation';

const auth = new Auth();
const validation = new Validation();

export default {
  api,
  auth,
  validation
};
