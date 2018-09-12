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
 * @requires NPM:swagger-ui-express
 * @requires ./middleware
 * @requires ./routes
 */

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import 'babel-polyfill' // eslint-disable-line

import middleware from './middleware';
import routes from './routes';
import swaggerDoc from '../api.swagger20.json';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT, 10) || 8000;

const app = express();

app.set('port', port);

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

// serves swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.get('/', (req, res) =>
  res.redirect('/doc'));

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

app.listen(port, () => {
  console.log(`App currently running on port: ${port}`);
});

export default app;
