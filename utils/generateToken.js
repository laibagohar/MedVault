import jwt from 'jsonwebtoken';   
const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  return token;
};

export default generateToken;