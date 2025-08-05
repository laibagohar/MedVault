// Express app setup will go here
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import middleware from './middleware/errorHandler.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);
app.use(middleware);
app.use('/uploads', express.static('uploads'));

export default app;