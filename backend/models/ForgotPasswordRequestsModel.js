const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, required: true, default: false },
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

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema);

module.exports = ForgotPassword;
