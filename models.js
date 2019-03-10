'use strict';

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  emailAddress: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

const CourseSchema = new Schema({
  user: [UserSchema],
  title: {type: String, required: true},
  description: {type: String, required: true},
  estimatedTime: String,
  materialsNeeded: String,
});


// module.exports = mongoose.model('Course', CourseSchema);
//
// module.exports = mongoose.model('User', UserSchema);

const Course = mongoose.model("Course", CourseSchema);
const User = mongoose.model("User", UserSchema);

module.exports = {
  Course, User
}
//
// // Expoer Course model
// module.exports.Course = Course;
