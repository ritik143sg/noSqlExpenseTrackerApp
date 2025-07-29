const User = require("../models/userModel");

const getAllPrimium = async (req, res) => {
  try {
    const expensePremium = await User.find({}, "username totalCost").sort({
      totalCost: -1,
    });

    res.json({ all: "expensePremium", data: expensePremium });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllPrimium;
