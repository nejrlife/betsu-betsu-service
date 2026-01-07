const mongoose = require('mongoose');

const expenseItemSchema = new mongoose.Schema(
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
    cashOutByMemberId: {
      type: String,
      required: true
    },
    forMemberId: {
      type: String,
      required: true
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => (v ? parseFloat(v.toString()) : null),
    },
    remarks: {
      type: String,
      required: false,
      default: ""
    },
    createdAt: {
      type: Date,
      required: true
    }
  }
);

expenseItemSchema.set('toJSON', { getters: true });
expenseItemSchema.set('toObject', { getters: true });

module.exports = mongoose.model('ExpenseItem', expenseItemSchema);