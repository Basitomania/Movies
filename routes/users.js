const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user)
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('User already registered');

  // passwordComplexity(complexityOptions).validate(req.body.password);

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }, { new: true });

  if(!user) return res.status(404).send('User does not exist');

  res.send(user);
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if(!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user)
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if(!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user)

})

module.exports = router;