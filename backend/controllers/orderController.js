const Order = require("../models/orderModel");

const getOrder = async (req, res) => {
  const user = req.user;
  try {
    const order = await Order.findOne({
      UserId: user._id,
    });

    res.json({ order: order });
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = getOrder;
