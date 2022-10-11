import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      //get data encoded in jwt.sign
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.userId = decodedToken._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'No access',
      });
    }
  } else {
    return res.status(403).json({
      message: 'No access',
    });
  }
};
