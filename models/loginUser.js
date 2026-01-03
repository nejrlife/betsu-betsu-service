const mongoose = require('mongoose');

const loginUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
  }
);

module.exports = mongoose.model('LoginUser', loginUserSchema);