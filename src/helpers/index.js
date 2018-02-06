/**
 * @fileOverview helper functions
 *
 * @author Franklin Chieze
 */

/**
 * @method sendResponse
 * @desc This method creates and sends a response object
 *
 * @param { object } req the request object
 * @param { object } res the response object
 * @param { object } data the response payload
 * @param { object } errors the response errors
 * @param { object } meta the response meta
 * @param { object } status the response status (defaults to 200)
 *
 * @returns { object } response
 */
function sendResponse(req, res, data, errors, meta, status = 200) {
  return res.status(status).send({ data, errors, meta });
}

export default {
  sendResponse
};
