import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { loginValidator, registrationValidator, postCreateValidator } from './validations.js';
import handleValidationErrors from './utils/handleValidationErrors.js'; //express-validator results
import checkAuth from './utils/checkAuth.js'; //jwt token decoding

import multer from 'multer';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

import dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.jrkuezh.mongodb.net/mern-blog?retryWrites=true&w=majority`,
  )
  .then(() => console.log('database is ok'))
  .catch((err) => console.log('database error - ', err));

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Wlcome to the MERN blog app');
});

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads');
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json()); //to read json files in express app
app.use(cors()); //fix CORS error
app.use('/uploads', express.static('uploads')); //to get static images on request /uploads/name

//user routes
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registrationValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//post routes
app.get('/post', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/post/:id', PostController.getOne);
app.post('/post', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
app.delete('/post/:id', checkAuth, PostController.remove);
app.patch('/post/:id', checkAuth, postCreateValidator, PostController.update);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Example app listening on port ${port}`);
});
