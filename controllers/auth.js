const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
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
      return res.status(400).json({ success: false, errors: { msg: "Email address was not found." } });
    }

    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};

// @Description - Generate Password Token and send email.
// @Route - POST - /api/v1/auth/forgotpassword
// @Access - Public
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: req.body.email }).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, errors: { msg: "Email address was not found." } });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    //const url = `${req.protocol}://${req.get("host")}/api/v1/resetpassword/${resetToken}`;
    const url = `http://localhost:3000/resetpassword/${resetToken}`;

    const message = `Please reset your password using link: <a href='${url}'>Click to reset password</a>`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset",
        text: message
      });

      res.json({ success: true, msg: "Email sent." });
    } catch (error) {
      console.log(error.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(400).json({ success: false, errors: { msg: "Email could not be sent." } });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};

// @Description - Reset Password
// @Route - PUT - /api/v1/auth/resetpassword/:resettoken
// @Access - Public
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  try {
    const user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, errors: { msg: "Invalid reset token." } });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ success: true, msg: "Password succesfully updated." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};

// @Description - Reset Profile Email
// @Route - PUT - /api/v1/auth/updateemail/
// @Access - Private
exports.updateEmail = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    const userExists = await User.findOne({ email: req.body.email }).select("-password");

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ success: false, errors: { msg: "Password is not correct." } });
    }

    if (userExists) {
      return res.status(400).json({ success: false, errors: { msg: "User with this email address already exists." } });
    }

    if (user.email === req.body.email) {
      return res.status(400).json({ success: false, errors: { msg: "Please provide different email address." } });
    }

    user.email = req.body.email;

    await user.save();

    res.json({ success: true, msg: "Email updated successfully." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};

// @Description - Reset Profile Password
// @Route - PUT - /api/v1/auth/updatepassword/
// @Access - Private
exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);

    const isValidPassword = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ success: false, errors: { msg: "Incorrect password provided." } });
    }

    user.password = req.body.newPassword;

    await user.save();

    res.json({ success: true, msg: "Password updated successfully. " });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, errors: { msg: "Server error." } });
  }
};
