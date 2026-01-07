const express = require('express');
const cors = require('cors');
const router = express.Router();
const Account = require('../models/account');
const ExpenseGrouping = require('../models/expenseGrouping');
const ExpenseItem = require('../models/expenseItem');
const Payment = require('../models/payment');
const mongoose = require('mongoose');
const mongo = require('mongodb');

// Getting all 
router.get('/', async (req, res) => {
  try {
    const account = await Account.find();
    res.json(account);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Getting by memberId 
router.get('/getAccountsByMember/:id', async (req, res) => {
  const memberId = req.params.id;
  if (memberId && memberId.length < 1) {
    return res.status(404).json({
      success: false,
      message: 'Member id param is empty'
    })
  }
  try {
    const accounts = await Account.find({
      contributingMemberIds: memberId
    });
    if (!accounts) {
      return res.status(404).json({ success: false, message: 'Account not found for the given memberId' });
    }
    res.json(accounts);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get('/expandAccountDetails/:id',
  getAccount,
  getAccountExpenses,
  getAccountPayments,
  async (req, res) => {
  const expandedAccountDoc = await req.account.populate('contributingMemberIds');


  const expandedAccount = expandedAccountDoc.toObject();
  expandedAccount.expenseDetails = req.expenseDetails;
  expandedAccount.paymentDetails = req.paymentDetails;
  res.status(200).json({
    success: true,
    account: expandedAccount
  });
});

router.post('/create', async (req, res) => {
  const { accountName, contributingMemberIds } = req.body;
  if (!contributingMemberIds || contributingMemberIds.length <= 0) {
    return res.status(404).json({ success: false, message: 'Contributing Members should be more than 0' });
  }
  const account = new Account({
    name: accountName,
    isAccountOpen: true,
    contributingMemberIds
  });
  try {
    const newAccount = await account.save();
    res.status(201).json({
      success: true,
      newAccount
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
})

router.post(
  '/addExpense',
  addExpenseValidations,
  getAccount,
  saveExpenseItems,
  async (req, res) => {
    try {
      const expenseItem = new ExpenseItem({
        ...req.expenseItemToSave
      });
      const newExpenseItem = await expenseItem.save();
      res.status(201).json({
        "status": "success",
        newExpenseItem
      });
      
    } catch (err) {
      res.status(400).json({
        message: err.message
      });
    }
})

router.post(
  '/makePayment',
  makePaymentValidations,
  getAccount,
  async (req, res) => {
  try {
    const { accountId, remarks, paidByMemberId, paidToMemberId, amount, createdAt } = req.body;
    const payment = new Payment({
      accountId,
      createdAt,
      paidByMemberId,
      paidToMemberId,
      remarks,
      amount
    });
    const savedPayment = await payment.save();
    res.status(201).json({
      "status": "success",
      savedPayment
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
})

// Deleting one
router.delete('/:id', getAccount, async (req, res) => {
  try {
    await res.account.deleteOne();
    res.json({
      message: 'Deleted account'
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
async function addExpenseValidations(req, res, next) {
  const { cashOutByMemberId } = req.body;
  if (!cashOutByMemberId) {
    return res.status(404).json({
      success: false,
      message: 'Loan shark member id should have a value'
    })
  }
  // if (!addExpenseDetails || addExpenseDetails.length <=0) {
  //   return res.status(404).json({
  //     success: false,
  //     message: 'Expense Details should be populated'
  //   })
  // }
  next()
}
async function makePaymentValidations(req, res, next) {
  const { remarks, paidByMemberId, paidToMemberId, amount } = req.body;
  if (!paidByMemberId) {
    return res.status(404).json({
      success: false,
      message: 'Payment should have a receiver.'
    })
  }
  if (!paidToMemberId) {
    return res.status(404).json({
      success: false,
      message: 'Payment should have a payer ID'
    })
  }
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(404).json({
      success: false,
      message: 'Payment should have an amount'
    })
  }
  next()
}
async function getAccount(req, res, next) {
  req.idFromBody = req.body.accountId;
  const accountId = req.idFromBody ? req.idFromBody : req.params.id;
  let account = undefined;
  try {
    account = await Account.findOne({ _id: accountId });

    if (account == null) {
      return res.status(404).json({
        success: true,
        message: 'Cannot find account'
      })
    } 
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
  req.account = account
  next()
}
async function getAccountExpenses(req, res, next) {
  if (!req.account._id) {
    return res.status(404).json({
      success: false,
      message: 'Unabled to get derived value from account'
    })
  }
  let expenses = [];
  try {
    expenses = await ExpenseItem.find({ accountId: req.account._id });
    if (expenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No expenses found for the given account'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
  req.expenseDetails = expenses
  next()
}

async function getAccountPayments(req, res, next) {
  if (!req.account._id) {
    return res.status(404).json({
      success: false,
      message: 'Unabled to get derived value from account'
    })
  } 
  let payments = [];
  try {
    payments = await Payment.find({ accountId: req.account._id });
    // if (payments.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'No payments found for the given account'
    //   });
    // }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
  req.paymentDetails = payments
  next()
}

async function saveExpenseItems(req, res, next) {
  const { accountId, name, cashOutByMemberId, forMemberId, amount, remarks, createdAt } = req.body;
  if (!amount || amount <= 0.0) {
    return res.status(200).json({
      success: true,
      message: 'Invalid Amount: Amount should be greater than 0'
    })
  }
  const expenseItemToSave = {
    accountId,
    name,
    cashOutByMemberId,
    forMemberId,
    amount: mongoose.Types.Decimal128.fromString(
      Number(amount).toFixed(2)
    ),
    remarks,
    createdAt
  };
  req.expenseItemToSave = expenseItemToSave;
  next()
}

module.exports = router;