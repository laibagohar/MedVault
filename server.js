// Server startup code
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
