const express = require('express');
const cors = require('cors');
const router = express.Router();
const Member = require('../models/member');
const dummyFunction = require('../utils/dummyUtils');

// Getting by Id 
router.get('/:id', dummyFunction, getMember, async (req, res) => {
  res.status(200).json({
    success: true,
    member: res.member
  });
});

// Getting all 
router.get('/', dummyFunction, async (req, res) => {
  try {
    const member = await Member.find();
    // setTimeout(() => {
    res.json(member);
    // }, 3000);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post('/', async (req, res) => {
  const bodyTransaction = req.body.transaction;
  if (bodyTransaction && Array.isArray(bodyTransaction)) {
    transaction = [...bodyTransaction]
  }  
  const member = new Member({
    name: req.body.name
  });
  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
})

// Deleting one
router.delete('/:id', getMember, async (req, res) => {
  try {
    await res.member.deleteOne();
    res.json({
      message: 'Deleted member'
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

async function getMember(req, res, next) {
  try {
    member = await Member.findOne({ _id: req.params.id });

    if (member == null) {
      return res.status(200).json({
        success: true,
        message: 'Cannot find member'
      })
    } 
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
  res.member = member
  next()
}

module.exports = router;