const mongoose = require('mongoose');

const expenseItemSchema = new mongoose.Schema(
  {
    cashOutByMemberId: {
      type: String,
      required: true
    },
    forMemberId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    remarks: {
      type: String,
      required: false,
      default: ""
    }
  }
);

module.exports = mongoose.model('ExpenseItem', expenseItemSchema);