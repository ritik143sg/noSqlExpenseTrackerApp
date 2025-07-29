const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    OrderId: { type: String, required: true },
    OrderStatus: { type: String, required: true },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
