// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

// GET all users (with optional query filters)
router.get('/all-user', async (req, res) => {
  try {
    await userController.getUsers(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a user by ID
router.get('/single-user/:id', async (req, res) => {
  try {
    await userController.getUserById(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new user
router.post('/create-user', async (req, res) => {
  try {
    await userController.createUser(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user by ID
router.put('/update-user/:id', async (req, res) => {
  try {
    await userController.updateUser(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user by ID
router.delete('/delete-user/:id', async (req, res) => {
  try {
    await userController.deleteUser(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
