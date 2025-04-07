// server.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/loginApp');


app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid password' });

  res.json({ message: `Welcome, ${user.username}` });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
