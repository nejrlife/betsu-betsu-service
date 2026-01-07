const express = require('express');
const cors = require('cors');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');

// isAuthenticated
router.get('/isAuthenticated', verifyToken, async (req, res) => {
  // res.status(200).json({
  //   success: true,
  //   customerId: req.customerId,
  //   message: 'User is authenticated'
  // });
  setTimeout(() => {
    res.status(200).json({
      success: true,
      customerId: req.customerId,
      message: 'User is authenticated'
    });
  }, 5000);
});

// Getting all 
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Getting one
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
})

router.post('/register', async (req, res) => {
  const { user } = req.body;

  const newUser = new User({
    user_id: user.id,
    password: user.password,
    customer_id: user.customer_id
  });
  try {
    const addedUser = await newUser.save();
    res.status(201).json(addedUser);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
})

// Deleting one
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({
      message: 'Deleted user'
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { client_id, user } = req.body;
    
    if (!client_id) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Invalid Client Id'
      });
    }

    if (!user.id) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Empty user id not allowed'
      });
    }

    if (!user.password) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Empty user password not allowed'
      });
    }

    const foundUser = await User.findOne({ user_id: user.id });

    if (!foundUser) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'User not found'
      });
    }
    // Validate the password (you should use a library like bcrypt for this)
    if (user.password !== foundUser.password) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Invalid credentials'
      });
    }

    // Create and send a JWT token
    const token = jwt.sign({ customerId: foundUser.customer_id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 6000,
    });

    res.status(200).json({
      success: true,
      isUserAuthenticated: true,
      customerId: foundUser.customer_id,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    } 
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.user = user
  next()
}

module.exports = router;