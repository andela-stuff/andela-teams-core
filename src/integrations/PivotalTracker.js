/**
 * @fileOverview Pivotal Tracker Integration
 *
 * @author Franklin Chieze
 *
 * @requires NPM:requestretry
 * @requires ./mock
 * @requires ../config
 */

import request from 'requestretry';

import mock from './mock';
import config from '../config';

const requestOptions = {
  baseUrl: 'https://api.github.com',
  fullResponse: false,
  json: true,
  headers: {
    'Content-Type': 'application/json',
    'X-TrackerToken': config.PIVOTAL_TRACKER_TOKEN,
  }
};
