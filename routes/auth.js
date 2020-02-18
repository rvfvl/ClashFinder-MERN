const router = require("express").Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");

const { register, login, currentUser } = require("../controllers/auth");

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

module.exports = router;
