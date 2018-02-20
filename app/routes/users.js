const express = require('express');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
  res.send('Login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.send('register');
});

module.exports = router;