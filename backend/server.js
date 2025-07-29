const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const dotenv = require("dotenv");
const connectDB = require("./utils/DB/DbConnect");
const fileRoute = require("./routes/fileRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");
const premiumRoute = require("./routes/premiumFeature");
const passwordRoute = require("./routes/passwordRoute");
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/orderModel");

connectDB();

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use(cors());

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/payment", paymentRoute);
app.use("/order", orderRoute);
app.use("/premiumFeature", premiumRoute);
app.use("/password", passwordRoute);
app.use("/file", fileRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
