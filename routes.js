'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
// Import course model
const Course = require('./models');

// Array to keep track of user records as they are created
const users = [];

// Initialize express router
const router = express.Router();

const authenticateUser = (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    const user = users.find(u => u.username === credentials.name);

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
       console.log(`Authentication successful for username: ${user.username}`);

       // Then store the retrieved user object on the request object
       // so any middleware functions that follow this middleware function
       // will have access to the user's information.
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

   // Return a response with a 401 Unauthorized HTTP status code.
   res.status(401).json({ message: 'Access Denied' });
  } else {
   // Or if user authentication succeeded...
   // Call the next() method.
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

// Route that creates a new user.
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
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  }

  // Get the user from the request body.
  const user = req.body;

  // Hash the new user's password.
  user.password = bcryptjs.hashSync(user.password);

  // Add the user to the `users` array.
  users.push(user);

  // Set the status to 201 Created and end the response.
  return res.status(201).end();
});



// Route for listing all courses
router.get('/courses', function(req, res, next){
  Course.find(function(err, courses){
    if (err) return next(err);
    res.json(courses);
  });
});

// Route for creating new courses
router.post('/courses', function(req, res, next){
  var course = new Course(req.body);
  course.save(function(err){
    if (err) return next(err);
    res.status(201);
    res.json(course);
  });
});

// Route for getting a specific course
router.get('/courses/:id', function(req, res, next){
  Course.findById(req.params.id, function(err, course){
    if (err) return next(err);
    res.json(course);
  });
});

// Route for editting a specific course
router.put('/courses/:id', function(req, res){
  res.json({
    response: "You sent me a PUT request",
    courseId: req.params.id,
    body: req.body
  });
});

// Route for deleting a specific course
router.delete('/courses/:id', function(req, res){
  res.json({
    response: "You sent me a DELETE request",
    courseId: req.params.id,
    body: req.body
  });
});

module.exports = router;
