// Token generation utility
import jwt from 'jsonwebtoken';   

// generate token
const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  return token;
};

export default generateToken;