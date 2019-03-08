'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  emailAddress: {type: String, required: true},
  password: {type: String, required: true},
});

var CourseSchema = new Schema({
  user: [UserSchema],
  title: {type: String, required: true},
  description: {type: String, required: true},
  estimatedTime: String,
  materialsNeeded: String,
});


module.exports = mongoose.model('Course', CourseSchema);
// var Course = mongoose.model("Course", CourseSchema);
//
// // Expoer Course model
// module.exports.Course = Course;
