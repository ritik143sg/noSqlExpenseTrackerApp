const { Cashfree, CFEnvironment } = require("cashfree-pg");

// Initialize Cashfree in Sandbox mode
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST430329ae80e0f32e41a393d78b923034",
  "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"
);

const createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "INR",
  customerID,
  customerPhone = "9090407368",
  customerEmail
) => {
  try {
    const expireDate = new Date(Date.now() + 60 * 60 * 1000);
    const formattedExpiryDate = expireDate.toISOString();

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: String(orderId),
      customer_details: {
        customer_id: String(customerID),
        customer_phone: customerPhone,
        customer_email: customerEmail,
      },
      order_meta: {
        return_url: `http://localhost:4000/payment/status/${orderId}`,
        payment_methods: "ccc, upi, nb",
      },
      order_expiry_time: formattedExpiryDate,
    };

    const response = await cashfree.PGCreateOrder(request);
    // console.log("Cashfree Order Created:", response.data);

    return response.data.payment_session_id;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw new Error("Cashfree order creation failed");
  }
};

const getPaymentStatus = async (orderId) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    let getOrderResponse = response.data;
    let orderStatus;

    console.log("jiiiiiiiiii");
    console.log(getOrderResponse);

    if (
      getOrderResponse.filter((tran) => {
        return tran.payment_status === "SUCCESS";
      }).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter((tran) => {
        return tran.payment_status === "PENDING";
      }).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }

    return orderStatus;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createOrder, getPaymentStatus };
