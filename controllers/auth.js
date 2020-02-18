const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// @Description - Register new user
// @Route - /api/v1/auth/register
// @Access - PUBLIC
exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    //Check if email already exists.
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
      return res.status(400).json({ success: false, errors: { msg: "Email already exists." } });
    }

    //Add new user to the database.
    const user = new User(req.body);
    const profile = new Profile({ userId: user.id });

    await user.save();
    await profile.save();

    jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw Error;

      res.status(201).json({ success: true, token });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};

// @Description - Login user
// @Route - /api/v1/auth/
// @Access - Public
exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    //Check if email already exists.
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ success: false, errors: { msg: "Invalid Credentials." } });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ success: false, errors: { msg: "Invalid Credentials." } });
    }

    jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 },
      (err, token) => {
        if (err) throw Error;

        res.json({ success: true, token });
      }
    );
  } catch (error) {
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};

// @Description - Get current user
// @Route - GET - /api/v1/auth/
// @Access - Private
exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, errors: { msg: "User not found." } });
    }

    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};
