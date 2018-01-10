import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import webpack from 'webpack';

dotenv.config();
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
