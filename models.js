'use strict';

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  title: {type: String, required: true},
  description: {type: String, required: true},
  estimatedTime: String,
  materialsNeeded: String,
});

const UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  emailAddress: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

const Course = mongoose.model("Course", CourseSchema);
const User = mongoose.model("User", UserSchema);

module.exports = {
  Course, User
}
