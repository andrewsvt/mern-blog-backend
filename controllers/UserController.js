import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

import dotenv from 'dotenv';
dotenv.config();

//login function
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: 'Please double-check your username or password and try again',
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Please double-check your username or password and try again',
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to login',
    });
  }
};

//register function
export const register = async (req, res) => {
  try {
    //password encryption
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    //save new user to the database
    const user = await doc.save();

    //user id encryption using jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });

    //separating the password hash from the rest of the user information
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register' });
  }
};

//authorization check function
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    //separating the password hash from the rest of the user information
    const { passwordHash, ...userData } = user._doc;

    res.json({ userData });
  } catch (err) {
    res.status(403).json({ message: 'No access' });
  }
};
