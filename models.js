'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  emailAddress: String,
  password: String
});

var CourseSchema = new Schema({
  user: [UserSchema],
  title: String,
  description: String,
  estimatedTime: String,
  materialsNeeded: String
});

var Course = mongoose.model("Course", CourseSchema);

module.exports.Course = Course;
