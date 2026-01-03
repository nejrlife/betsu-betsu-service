const express = require('express');
const cors = require('cors');
const router = express.Router();
const Customer = require('../models/customer');
const verifyToken = require('../utils/tokenUtils');

// Getting by Id 
router.get('/:id', verifyToken, getCustomer, async (req, res) => {
  res.status(200).json({
    success: true,
    customer: res.customer
  });
});

// Getting all 
router.get('/', verifyToken, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post('/', async (req, res) => {
  let transaction = null;
  const bodyTransaction = req.body.transaction;
  if (bodyTransaction && Array.isArray(bodyTransaction)) {
    transaction = [...bodyTransaction]
  }  
  const customer = new Customer({
    id: req.body.id,
    name: req.body.name,
    last_login: req.body.last_login,
    balance: req.body.balance,
    transaction
  });
  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
})

// Deleting one
router.delete('/:id', getCustomer, async (req, res) => {
  try {
    await res.customer.deleteOne();
    res.json({
      message: 'Deleted customer'
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

async function getCustomer(req, res, next) {
  try {
    customer = await Customer.findOne({ id: req.params.id });

    if (customer == null) {
      return res.status(200).json({
        success: true,
        message: 'Cannot find customer'
      })
    } 
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
  res.customer = customer
  next()
}

module.exports = router;