// Express app setup will go here
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import userroutes from './routes/userRoutes.js';

import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/users', userroutes);


app.use(errorHandler);

export default app;
