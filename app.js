import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(apiRoutes);

app.use(errorHandler);

export default app;