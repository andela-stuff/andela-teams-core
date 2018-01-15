import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import webpack from 'webpack';

import routes from './routes';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT, 10) || 3000;

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Andela Teams API',
    version: '1.0.0',
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
// Set response content type
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// serves swagger
app.get('/', (req, res) => {
  res.send(swaggerSpec);
});

routes(app);

app.listen(port);
export default app;
