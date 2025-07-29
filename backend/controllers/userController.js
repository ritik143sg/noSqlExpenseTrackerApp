const { genTokent } = require("../middleWare/authentication");
const { encryptPassword, comparePassword } = require("../middleWare/bycrypt");
const User = require("../models/userModel");

const addUser = async (req, res) => {
  try {
    const data = req.body;
    const pass = await encryptPassword(data.password);

    const checkUser = await User.findOne({ email: data.email });

    console.log(checkUser);

    if (checkUser) {
      res.status(500).json({ msg: "User Already Exist " });
    } else {
      const user = new User({
        username: data.username,
        email: data.email,
        password: pass,
      });
      await user.save();
      res.status(201).json({ msg: "User added ", user: user });
    }
  } catch (error) {
    res.status(500).json({ msg: "User add failed ", error: error.message });
  }
};

const logUser = async (req, res) => {
  const data = req.body;
  try {
    const checkUser = await User.findOne({ email: data.email });

    if (!checkUser) {
      res.status(404).json({ msg: "User Not Exist " });
    } else {
      if (!(await comparePassword(data.password, checkUser.password))) {
        res.status(401).json({ msg: "Wrong Password - User Not Authorised " });
      } else {
        const token = genTokent(checkUser);
        res.status(201).json({
          msg: "User login successful",
          token: token,
          user: checkUser,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: "User Login failed", error: error.message });
  }
};

const setPassword = async (req, res) => {
  try {
    const data = req.body;

    const pass = await encryptPassword(data.password);

    const checkUser = await User.findOne({
      where: {
        email: data.email,
      },
    });
    if (!checkUser) {
      res.status(500).json({ msg: "User not Exist " });
    } else {
      const user = await User.update(
        {
          password: pass,
        },
        {
          where: {
            email: checkUser.email,
          },
        }
      );

      res.status(201).json({ msg: "password set ", user: user });
    }
  } catch (error) {
    res.status(500).json({ msg: "password set failed ", error: error.message });
  }
};

module.exports = { addUser, logUser, setPassword };
