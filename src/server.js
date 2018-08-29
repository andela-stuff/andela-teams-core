/**
 * @fileOverview Application's entry point
 *
 * @author Franklin Chieze
 *
 * @requires NPM:body-parser
 * @requires NPM:cors
 * @requires NPM:dotenv
 * @requires NPM:express
 * @requires NPM:morgan
 * @requires NPM:path
 * @requires NPM:swagger-jsdoc
 * @requires ./middleware
 * @requires ./routes
 */

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import 'babel-polyfill'


import middleware from './middleware';
import routes from './routes';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT, 10) || 8000;

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Andela Teams API',
    version: '1.0',
    description: 'Andela Teams seeks to automate some of the routine actions' +
    ' taken by simulations learning facilitators at Andela.'
  },
};
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

const app = express();

app.set('port', port);

// Log requests to the console.
if (env !== 'test') {
  app.use(logger('dev'));
}

// CORS
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin');
  res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT');
  next();
});
*/
app.use(cors());

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serves directory with url as static files
app.use(express.static(path.join(__dirname, '../api-docs/')));

// serves swagger
app.get('/api-doc.json', (req, res) => {
  res.send(swaggerSpec);
});

// set content type
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

app.use(middleware.api);

routes(app);

// 404 error handler
app.use((req, res) =>
  res.sendFailure([`The endpoint '${req.path}' could not be found.`], 404));

app.listen(port);

export default app;
