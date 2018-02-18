/**
 * @fileOverview index file for middleware
 *
 * @author Franklin Chieze
 *
 * @requires ./api
 * @requires ./pagination
 * @requires ./Validation
 */

import api from './api';
import pagination from './pagination';
import Validation from './Validation';

const validation = new Validation();

export default {
  api,
  pagination,
  validation
};
