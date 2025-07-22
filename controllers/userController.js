// User controller logic with Sequelize
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import dotenv from 'dotenv';
dotenv.config();
// login function
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt for:', email);
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name , gender: user.gender , dob: user.dob } });
  } catch (error) {
   console.error('Login error:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
};

