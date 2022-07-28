const mongoose = require("mongoose");
const { orderSchema } = require("./datastructure");
const orderModel = mongoose.model("orders", orderSchema);
exports.orderModel = orderModel;
