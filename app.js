// Express app setup will go here
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import path from 'path';
import middleware from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', routes);
app.use(middleware);
app.use('/uploads', express.static('D:/MedVault/uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorHandler);

export default app;