'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
// Import course model
const Course = require('./models').Course;
const User = require('./models').User;

// Array to keep track of user records as they are created
const users = [];

// Initialize express router
const router = express.Router();

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
          res.json({ message: `Authentication failure for email address: ${user.emailAddress}` });
        }
      } else {
        res.json({ message: `User not found for email address: ${credentials.name}` });
      }
    });
  } else {
    res.json({ message: 'Auth header not found' });
  }
}


//   let message = null;
//
//   // Parse the user's credentials from the Authorization header.
//   const credentials = auth(req);
//
//   // If the user's credentials are available...
//   if (credentials) {
//     // Attempt to retrieve the user from the data store
//     // by their email address(i.e. the user's "key"
//     // from the Authorization header).
//     const user = users.find(u => u.emailAddress === credentials.emailAddress);
//
//     // If a user was successfully retrieved from the data store...
//     if (user) {
//       // Use the bcryptjs npm package to compare the user's password
//       // (from the Authorization header) to the user's password
//       // that was retrieved from the data store.
//       const authenticated = bcryptjs
//         .compareSync(credentials.pass, user.password);
//
//       // If the passwords match...
//       if (authenticated) {
//        console.log(`Authentication successful for email address: ${user.emailAddress}`);
//
//        // Then store the retrieved user object on the request object
//        // so any middleware functions that follow this middleware function
//        // will have access to the user's information.
//        req.currentUser = user;
//       } else {
//         message = `Authentication failure for email address: ${user.emailAddress}`;
//       }
//   } else {
//     message = `User not found for email address: ${credentials.emailAddress}`;
//   }
// } else {
//   message = 'Auth header not found';
// }
//
//  // If user authentication failed...
// if (message) {
//    console.warn(message);
//
//    // Return a response with a 401 Unauthorized HTTP status code.
//    res.status(401).json({ message: 'Access Denied' });
//   } else {
//    // Or if user authentication succeeded...
//    // Call the next() method.
//     next();
//   }
// };

// Route that returns the current authenticated user
router.get('/users', authenticateUser,(req, res) => {
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
  // // If there are validation errors...
  // if (!errors.isEmpty()) {
  //   // Use the Array `map()` method to get a list of error messages.
  //   const errorMessages = errors.array().map(error => error.msg);
  //
  //   // Return the validation errors to the client.
  //   return res.status(400).json({ errors: errorMessages });
  // }
  //
  // // Get the user from the request body.
  // const user = req.body;
  //
  // // Hash the new user's password.
  // user.password = bcryptjs.hashSync(user.password);
  //
  // // Add the user to the `users` array.
  // //users.push(user);
  //
  // // Set the status to 201 Created and end the response.
  // return res.status(201).end();
});


// Parameter handler for course 'id'
// router.param('id', function(req, res, next, id){
//   Course.findById(id, function(err, doc){
//     if (err) return next(err);
//     if (!doc) {
//       err = new Error("Not Found");
//       err.status = 404;
//       return next(err);
//     }
//     req.course = doc;
//     return next();
//   });
// });


// Route for listing all courses
router.get('/courses', function(req, res, next){
  Course.find(function(err, courses){
    if (err) return next(err);
    res.json(courses);
  });
});

// Route for creating new courses
router.post('/courses', function(req, res, next){
  const course = new Course(req.body);
  course.save(function(err){
    if (err) return next(err);
    res.status(201);
    res.json(course);
  });
});

// Route for getting a specific course
router.get('/courses/:id', function(req, res, next){
  // res.json(req.course);
  Course.findById(req.params.id, function(err, course){
    if (err) return next(err);
    res.json(course);
  });
});

// Route for editting a specific course
router.put('/courses/:id', authenticateUser, function(req, res){
  Course.findById(req.params.id, function(err, course){
    if (err) return next(err);
    course.title = req.body.title;
    course.description = req.body.description;
    course.estimatedTime = req.body.estimatedTime;
    course.materialsNeeded = req.body.materialsNeeded;
    course.save(function(err){
      if (err) return next(err);
      res.json(course);
    });
  });
  // req.course.update(req.body, function(err, result){
  //   if (err) return next(err);
  //   res.json(result);
  // });
});

// Route for deleting a specific course
router.delete('/courses/:id', authenticateUser, function(req, res){
  Course.remove({ _id: req.params.id}, function(err, course) {
    if (err) return next(err);
    res.json({ message: "Successfully deleted"});
  });
});

module.exports = router;
