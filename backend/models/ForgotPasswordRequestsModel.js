const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema);

module.exports = ForgotPassword;
