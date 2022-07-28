const mongoose = require("mongoose");

orderSchema = new mongoose.Schema({
  userId_auth: {
    type: String,
    required: true,
  },
  userId_stripe: {
    type: String,
    required: true,
  },
  cardId: {
    type: String,
    required: true,
  },
  email: String,
  timeStamp: {
    type: Date,
  },
  planName: String,
  amount: Number,
  currency: String,
  isCancelled: Boolean,
});

exports.orderSchema = orderSchema;
