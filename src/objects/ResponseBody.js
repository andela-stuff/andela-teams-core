/**
 * @fileOverview A class to represent a server response's body
 *
 * @author Franklin Chieze
 */

/**
 * A class to represent a server response's body
 * @class
 *
 * @constructor
 *
 * @property {any} data the response data
 * @property {array} errors the response errors
 * @property {any} meta the response meta
 */
class ResponseBody {
  /**
   * constructor
   */
  constructor() {
    this.data = null;
    this.errors = null;
    this.meta = null;
  }
}

export default ResponseBody;
