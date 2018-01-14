import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import webpack from 'webpack';

import routes from './routes';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World Again!');
});

routes(app);

app.listen(process.env.PORT || 3000);
export default app;
