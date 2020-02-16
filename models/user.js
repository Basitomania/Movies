const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const PasswordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minLength: 5,
    maxLength: 255
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024
  },
  isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('myPrivateKey'));
  return token
}

const User = mongoose.model('User', userSchema);

function validateUser (user) {
  // const complexityOptions = {
  //   min: 6,
  //   max: 30,
  //   lowerCase: 1,
  //   upperCase: 1,
  //   numeric: 1,
  //   symbol: 1,
  //   requirementCount: 2,
  // }
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(user, schema)
}

exports.User = User;
exports.validate = validateUser;

