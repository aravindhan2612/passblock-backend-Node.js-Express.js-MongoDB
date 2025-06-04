const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST - Create a new user
router.post('/', async (req, res) => {
  try {
     await new Promise(resolve => setTimeout(resolve, 3000));
    const { email } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Get all users
router.get('/', async (req, res) => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    //  await new Promise(resolve => setTimeout(resolve, 2000));
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Get single user by email and password (insecure version)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: 'User not found' });

    // Compare plaintext passwords
    if (user.password !== password)
      return res.status(401).json({ error: 'Invalid credentials' });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;