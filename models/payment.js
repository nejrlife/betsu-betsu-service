const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paidByMemberId: {
      type: String,
      required: true
    },
    paidToMemberId: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    remarks: {
      type: String,
      required: false,
      default: ""
    },
  }
);

module.exports = mongoose.model('Payment', paymentSchema);