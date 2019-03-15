'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
// Import course, User models
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
    const err = new Error("Authentication is required");
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
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: req.body.password,
  });
  if (user.firstName && user.lastName && user.emailAddress && user.password) {
    user.password = bcryptjs.hashSync(req.body.password);
    user.save(function(err, user){
      if (err) return next(err);
      res.location('/');
      res.send(201);
    });
  } else {
    const err = new Error("firstName, lastName, emailAddress, and password are required.");
    err.status = 400;
    next(err);
  }
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
  const course = new Course({
    user: req.currentUser._id,
    title: req.body.title,
    description: req.body.description,
    estimatedTime: req.body.estimatedTime,
    materialsNeeded: req.body.materialsNeeded
  });
  if (course.title && course.description) {
    course.save(function(err, course){
      if (err) return next(err);
      res.location('/courses/' + course._id);
      res.send(201);
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
    course.save(req.body, function(err){
      if (err) return next(err);
      res.send(204);
    });
  });
});


// Route for deleting a specific course
router.delete('/courses/:id', authenticateUser, function(req, res, next){
  Course.remove({ _id: req.params.id}, function(err, course) {
    if (err) return next(err);
    res.status(204);
    res.json({ message: "Successfully deleted."})
  });
});

module.exports = router;
