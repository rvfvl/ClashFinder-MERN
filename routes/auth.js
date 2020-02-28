const router = require("express").Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");

const {
  register,
  login,
  currentUser,
  forgotPassword,
  resetPassword,
  updateEmail,
  updatePassword
} = require("../controllers/auth");

router
  .route("/")
  .get(auth, currentUser)
  .post(
    [
      check("email")
        .isEmail()
        .withMessage("Please enter correct email address."),
      check("password")
        .exists()
        .withMessage("You need to enter a password.")
    ],
    login
  );

router.route("/updateemail").put(
  [
    auth,
    check("email")
      .isEmail()
      .withMessage("Please enter correct email address."),
    check("password")
      .exists()
      .withMessage("You need to enter a password.")
  ],
  updateEmail
);

router.route("/updatepassword").put(
  [
    auth,
    check("oldPassword")
      .exists()
      .withMessage("You need to enter a password."),
    check("newPassword")
      .isLength({ min: 5 })
      .withMessage("Password needs to be at least 5 characters long.")
  ],
  updatePassword
);

router.route("/register").post(
  [
    check("email")
      .isEmail()
      .withMessage("Please enter correct email address."),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password needs to be at least 5 characters long.")
  ],
  register
);

router.route("/forgotpassword").post(
  check("email")
    .isEmail()
    .withMessage("Please enter correct email address."),
  forgotPassword
);

router.route("/resetPassword/:resettoken").put(
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password needs to be at least 5 characters long."),
  resetPassword
);

module.exports = router;
