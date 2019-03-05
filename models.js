'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
  text: String,
  createdAt: Date;
});
