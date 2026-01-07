const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseItem'
      }
    ],
    remarks: {
      type: String,
      required: false,
      default: ""
    }
  }
);

module.exports = mongoose.model('Expense', expenseSchema);