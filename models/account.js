const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    isAccountOpen: {
      type: Boolean,
      required: true
    },
    contributingMemberIds: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
      }],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        }
      }
    }
    // createdOn: {
    //   type: Date,
    //   required: true
    // },
    // createdBy: {
    //   type: String,
    //   required: true
    // },
    // lastUpdatedOn: {
    //   type: Date,
    //   required: true
    // },
    // lastUpdatedBy: {
    //   type: String,
    //   required: true
    // },
  }
);

module.exports = mongoose.model('Account', accountSchema);