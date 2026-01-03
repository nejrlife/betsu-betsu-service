const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    last_login: {
      type: String,
      required: true
    },
    balance: {
      type: String,
      required: true
    },
    transaction: [
      {
        date: {
          type: String,
          required: true
        },
        desc: {
          type: String
        },
        amount: {
          type: String,
          required: true
        }
      },
    ],
  }
);

module.exports = mongoose.model('Customer', customerSchema);