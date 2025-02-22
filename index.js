const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./schema');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database', err));
  

// POST API endpoint
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate user data
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Validation error: All fields are required' });
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: `Validation error: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
