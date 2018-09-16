/**
 * @fileOverview index file for integrations
 *
 * @author Franklin Chieze
 *
 * @requires ./Slack
 */

import Github from './Github';
import PivotalTracker from './PivotalTracker';
import Slack from './Slack';

export default {
  Github,
  PivotalTracker,
  Slack
};
