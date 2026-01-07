const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => (v ? parseFloat(v.toString()) : null),
    },
    paidByMemberId: {
      type: String,
      required: true
    },
    paidToMemberId: {
      type: String,
      required: true
    },
    createdAt: {
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


paymentSchema.set('toJSON', { getters: true });
paymentSchema.set('toObject', { getters: true });

module.exports = mongoose.model('Payment', paymentSchema);