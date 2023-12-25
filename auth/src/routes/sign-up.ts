import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { User } from '../../models/user.model';

import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post('/api/users/sign-up',
[
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const {
    email,
    password,
  } = req.body;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return res.status(409).send({
      success: false,
      message: 'Email in use',
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: {
        email,
      },
    });
  } catch (error: any) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

export { router as signUpRouter };