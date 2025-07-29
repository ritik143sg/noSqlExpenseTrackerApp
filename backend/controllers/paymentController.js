const Order = require("../models/orderModel");
const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashFreeService");

const getSesssionId = async (req, res) => {
  const user = req.user;

  console.log("11111111111111", user);

  try {
    await Order.deleteOne({ UserId: user._id });

    const orderID = "ORDER_" + Date.now();

    const id = await createOrder(
      orderID,
      199,
      "INR",
      user._id,
      "9988776633",
      user.email
    );

    const order = new Order({
      OrderId: orderID,
      OrderStatus: "Pending",
      UserId: user._id,
    });

    await order.save();

    res.json({ id: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const paymentStatus = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const response = await getPaymentStatus(id);
    console.log(response);

    await Order.updateOne({ OrderId: id }, { $set: { OrderStatus: response } });

    const updatedOrder = await Order.findOne({ OrderId: id });

    res.send(`<body class="bg-light d-flex justify-content-center align-items-center vh-100 ">
      <div class="text-center">
        <h1 class="text-success display-4 fw-bold">Payment Successful!</h1>
        <p class="lead">Thank you for your purchase. Your transaction was completed successfully.
        Your order Id is ${id}
        </p>
        <a href="/expense.html" class="btn btn-primary mt-3">Go Home</a>
      </div>
      
    </body>`);
  } catch (err) {
    console.error("Fetch payment error:", err);
  }
};

module.exports = { getSesssionId, paymentStatus };
