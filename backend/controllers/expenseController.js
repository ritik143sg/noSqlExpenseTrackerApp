const AWS = require("aws-sdk");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

const dotenv = require("dotenv");
dotenv.config();

function uploadToS3(data, fileName) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Error uploading to S3", err);
        reject(err);
      } else {
        console.log("Upload Success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

const addExpense = async (req, res) => {
  try {
    const data = req.body;

    const expense = await Expense({
      amount: data.amount,
      description: data.description,
      category: data.category,
      UserId: req.user._id,
    });
    await expense.save();
    if (data.category == "salary") {
      res.status(201).json({ msg: "expense Added", expense: expense });
    } else {
      await User.updateOne(
        { _id: req.user._id },
        { $inc: { totalCost: Number(data.amount) } }
      );

      res.status(201).json({ msg: "expense Added", expense: expense });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "expense Adding failed", error: error.message });
  }
};

const getAllExpense = async (req, res) => {
  const user = req.user;
  const pageId = req.params.id;
  const rowLimit = Number(req.query.limit);

  try {
    const expenses = await Expense.find({ UserId: user._id })
      .limit(rowLimit)
      .sort({ createdAt: -1 })
      .skip((Number(pageId) - 1) * rowLimit);

    const expenses1 = await Expense.find({ UserId: user._id })
      .limit(rowLimit)
      .sort({ createdAt: -1 })
      .skip(Number(pageId) * rowLimit);

    let pre = false;
    let curr = false;
    let next = false;

    if (pageId != 1) {
      pre = true;
    }
    if (expenses.length > 0) {
      curr = true;
    }

    if (expenses1.length > 0) {
      next = true;
    }

    res.status(201).json({
      msg: "expense is retrive",
      expense: expenses,
      page: { pre, curr, next, pageId },
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "expense getting failed", error: error.message });
  }
};

const getLeaderBoardExpense = async (req, res) => {
  const user = req.user;

  try {
    const expenses = await Expense.find({ UserId: user._id }).sort({
      createdAt: -1,
    });

    res.status(201).json({
      msg: "expenses retrived",
      expense: expenses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "expense getting failed", error: error.message });
  }
};

const delExpense = async (req, res) => {
  const user = req.user;

  try {
    const id = req.params.id;

    const expense = await Expense.findOne({ _id: id });

    if (expense) {
      await Expense.deleteOne({
        _id: id,
      });
      const user = await User.findOne({ _id: req.user._id });
      if (expense.category == "salary") {
        res
          .status(201)
          .json({ msg: "expense Addedfghjkhjk", expense: expense });
      } else {
        await User.updateOne(
          { _id: req.user._id },
          { $set: { totalCost: user.totalCost - expense.amount } }
        );
      }
      res.status(201).json({ msg: "expense deleted", expense: expense });
    } else res.status(404).json({ msg: "Expense Not Found" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "expense deletion failed", error: error.message });
  }
};

const getExpenseFile = async (req, res) => {
  const user = req.user;

  try {
    const expenses = await Expense.find({ UserId: user._id }).sort({
      createdAt: -1,
    });

    const stringExpense = JSON.stringify(expenses);
    const fileName = `expenses_${user._id}_${Date.now()}.txt`;
    const fileUrl = await uploadToS3(stringExpense, fileName);

    res.status(201).json({
      msg: "File retrieved",
      expense: expenses,
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("getExpenseFile error:", error);
    res
      .status(500)
      .json({ msg: "Expense fetching failed", error: error.message });
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  delExpense,
  getLeaderBoardExpense,
  getExpenseFile,
};
