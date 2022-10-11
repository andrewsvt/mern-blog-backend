import { body } from 'express-validator';

export const loginValidator = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Password must be 5 character at least').isLength({ min: 5 }),
];

export const registrationValidator = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Password must be 5 character at least').isLength({ min: 5 }),
  body('fullName', 'Invalid name').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid avatar url').optional().isURL(),
];

export const postCreateValidator = [
  body('title', 'Enter post title').isLength({ min: 3 }).isString(),
  body('text', 'Enter post text').isLength({ min: 10 }).isString(),
  body('tags', 'Invalid tag format').optional().isString(),
  body('imageUrl', 'Invalid image url').optional().isString(),
];
