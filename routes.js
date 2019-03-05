'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const express = require('express');
const { check, validationResult } = require('express-validator/check');

// Array to keep track of user records as they are created
const users = [];

const router = express.Router();

const authenticateUser = (req, res, next) => {
  // Parse the user's credentials from the Authorization header
  const credentials = auth(req);

  // If user's credentails are available...
  if (credentials) {
    const user = users.find(u => u.username === credentials.name);

    // If a user was successfully retrieved from the data store...
    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    res.status(404).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

// Route that returns the current authenticated user
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;

  res.json({
    name: user.name,
    username: user.username,
  });
});

// Route that create a new user
router.post('/users', [
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check('username')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "username"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
], (req, res) => {
  // Attempt to get the validation result from the Request object
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Array map method to get a list of error messages
    const errorMessages = errors.array().map(error => error.msg);
    // Return the validation errors to the client
    return  res.status(404).json({ errors: errorMessages });
  }

  // Get the user from the request body
  const user = req.body;

  // Hash the new user's password
  user.password = bcryptjs.hashSync(user.password);

  // Add the user to the 'users' array
  users.push(user);

  // Set the status to 201 Created and end the response
  res.status(201).end();
});


module.exports = router;
