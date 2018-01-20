/**
 * @fileOverview Application's entry point
 *
 * @author Franklin Chieze
 *
 * @requires NPM:body-parser
 * @requires NPM:dotenv
 * @requires NPM:express
 * @requires NPM:morgan
 * @requires NPM:path
 * @requires NPM:swagger-jsdoc
 * @requires ./routes
 */

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

import routes from './routes';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT, 10) || 3000;

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
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set important headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin');
  res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT');
  next();
});

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

routes(app);

app.listen(port);
export default app;
