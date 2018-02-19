/**
 * @fileOverview index file for middleware
 *
 * @author Franklin Chieze
 *
 * @requires ./api
 * @requires ./Validation
 */

import api from './api';
import Validation from './Validation';

const validation = new Validation();

export default {
  api,
  validation
};
