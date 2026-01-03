const express = require('express');
const cors = require('cors');
const router = express.Router();
const LoginUser = require('../models/loginUser');
const Member = require('../models/member');
const verifyToken = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');

// isAuthenticated
router.get('/isAuthenticated', verifyToken, async (req, res) => {
  // setTimeout(() => {
  res.status(200).json({
    success: true,
    message: 'Login user is authenticated',
    memberId: req.memberId
  });
  // }, 3000);
});

// Getting all 
router.get('/', async (req, res) => {
  try {
    const loginUsers = await LoginUser.find();
    res.json(loginUsers);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Getting one
// router.get('/:id', getLoginUser, (req, res) => {
//   res.json(res.loginUser);
// })

router.post('/register', getMember, async (req, res) => {
  const { memberId, loginUserCreds } = req.body;
  const newLoginUser = new LoginUser({
    username: loginUserCreds.username,
    password: loginUserCreds.password,
    memberId: res.memberId
  });
  try {
    const addedLoginUser = await newLoginUser.save();
    res.status(201).json(addedLoginUser);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
})

// Deleting one
// router.delete('/:id', getLoginUser, async (req, res) => {
//   try {
//     await res.loginUser.deleteOne();
//     res.json({
//       message: 'Deleted user'
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// });

// User login
router.post('/login', async (req, res) => {
  console.log('emmy');
  try {
    const { clientId, loginUser } = req.body;
    
    if (!clientId) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Invalid Client Id'
      });
    }

    if (!loginUser.username) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Empty username not allowed'
      });
    }

    if (!loginUser.password) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Empty user password not allowed'
      });
    }
    console.log('emmy');
    const foundLoginUser = await LoginUser.findOne({ username: loginUser.username });
    console.log(foundLoginUser);
    if (!foundLoginUser) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'User not found'
      });
    }
    // Validate the password (you should use a library like bcrypt for this)
    if (loginUser.password !== foundLoginUser.password) {
      return res.status(200).json({
        success: true,
        isUserAuthenticated: false,
        message: 'Invalid loginUserCreds',
      });
    }

    // Create and send a JWT token
    const token = jwt.sign({
      username: foundLoginUser.username,
      memberId: foundLoginUser.memberId,
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: 6000,
    });

    res.status(200).json({
      success: true,
      isUserAuthenticated: true,
      memberId: foundLoginUser.memberId,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

async function getLoginUser(req, res, next) {
  try {
    loginUser = await LoginUser.findById(req.params.id);
    if (loginUser == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    } 
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.loginUser = loginUser
  next()
}

async function getMember(req, res, next) {
  const { memberId } = req.body;
  try {
    member = await Member.findById(memberId);
    if (member == null) {
      return res.status(404).json({ message: 'Cannot find Member' })
    } 
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.memberId = member._id
  next()
}

module.exports = router;