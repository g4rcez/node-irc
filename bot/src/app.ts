import express from 'express';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import logger from './util/logger';
import dotenv from 'dotenv';
import expressValidator from 'express-validator';

import { user } from './api/github';

dotenv.config({ path: '.env.example' });
const app = express();
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.get('/git/:nickname', user);

export default app;
