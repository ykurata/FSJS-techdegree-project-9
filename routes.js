'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
// Import course model
const Course = require('./models').Course;
const User = require('./models').User;

// Initialize express router
const router = express.Router();


// User authenticate middleware
const authenticateUser = (req, res, next) => {
  const credentials = auth(req);

  if (credentials) {
    User.findOne({ emailAddress: credentials.name }, function(err, user){
      if (err) return next(err);

      if (user) {
        const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

        if (authenticated) {
          console.log(`Authentication successful for email address: ${user.emailAddress}`);
          req.currentUser = user;
          next();
        } else {
          const err = new Error(`Authentication failure for email address: ${user.emailAddress}`);
          err.status = 401;
          next(err);
        }
      } else {
        err = new Error(`User not found for email address: ${credentials.name}`);
        err.status = 401;
        next(err);
      }
    });
  } else {
    const err = new Error("User not found");
    err.status = 401;
    next(err);
  }
}


// Route that returns the current authenticated user
router.get('/users', authenticateUser, (req, res) => {
  User.find(function(err, user){
    if (err) return next(err);
    res.json(req.currentUser);
  });
});


// Route that creates a new user.
router.post('/users', function(req, res, next){
  const user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.emailAddress = req.body.emailAddress;
  user.password = bcryptjs.hashSync(req.body.password);
  user.save(function(err){
    if (err) return next(err);
    res.status = 201;
    res.json(user);
  });
});


// Route for listing all courses
router.get('/courses', function(req, res, next){
  Course.find(function(err, courses){
    if (err) return next(err);
    res.json(courses);
  });
});

// Route for creating a new course
router.post('/courses', authenticateUser, function(req, res, next){
  const course = new Course();
  course.user = req.currentUser._id;
  course.title = req.body.title;
  course.description = req.body.description;
  course.estimatedTime = req.body.estimatedTime;
  course.materialsNeeded = req.body.materialsNeeded;
  if (course.title && course.description) {
    course.save(function(err, course){
      if (err) return next(err);
      res.status(201);
      res.json(course);
    });
  } else {
    const err = new Error("Title and description are required.");
    err.status =400;
    next(err);
  }
});

// Route for getting a specific course
router.get('/courses/:id', function(req, res, next){
  Course.findById(req.params.id, function(err, course){
    if (err) return next(err);
    res.json(course);
  });
});

// Route for editting a specific course
router.put('/courses/:id', authenticateUser, function(req, res, next){
  Course.findById(req.params.id, function(err, course){
    if (err) return next(err);
    course.title = req.body.title;
    course.description = req.body.description;
    course.estimatedTime = req.body.estimatedTime;
    course.materialsNeeded = req.body.materialsNeeded;
    course.save(function(err){
      if (err) return next(err);
      res.status(204);
    });
  });
});

// Route for deleting a specific course
router.delete('/courses/:id', authenticateUser, function(req, res, next){
  Course.remove({ _id: req.params.id}, function(err, course) {
    if (err) return next(err);
    res.status(204);
  });
});

module.exports = router;
