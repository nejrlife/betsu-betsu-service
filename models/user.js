const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    customer_id: {
      type: String,
      required: true
    }
  }
);

module.exports = mongoose.model('User', userSchema);