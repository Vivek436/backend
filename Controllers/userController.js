const user = require("../Models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// ============================
// Get All Users
// ============================
const getAllUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Register User
// ============================
const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => err.msg),
    });
  }

  try {
    const data = req.body;

    // 🔥 Duplicate user check
    const existingUser = await user.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 Create new user
    let hashPassword = bcrypt.hashSync(data.password, 10);
    const User = await user.create({ ...data, password: hashPassword });
    console.log(User);

    return res.status(200).json({
      message: "User registered successfully",
      user: User,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ============================
// Login User
// ============================

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔥 Find user by email
    const User = await user.findOne({ email });

    if (!User) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 Compare password

    const comparePassword = bcrypt.compareSync(password, User.password);
    console.log(comparePassword);

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);

    //send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      message: "Login successful",
      user: User,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  const User = await user.findById(req.userId).select("-password");
  res.json({ user: User });
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { getAllUsers, registerUser, LoginUser, getMe, logoutUser };
