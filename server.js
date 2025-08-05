// Server startup code
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database connection
const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connection established successfully');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
} catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();