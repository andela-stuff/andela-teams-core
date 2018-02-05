/**
 * @fileOverview A class to represent a server response
 *
 * @author Franklin Chieze
 */

/**
 * A class to represent a server response
 * @class
 *
 * @constructor
 *
 * @property {any} data the response data
 * @property {array} errors the response errors
 * @property {any} meta the response meta
 */
class Response {
  /**
   * constructor
   */
  constructor() {
    this.data = null;
    this.errors = null;
    this.meta = null;
  }
}

export default Response;
