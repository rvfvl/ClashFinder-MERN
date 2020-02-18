const router = require("express").Router();
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const countriesData = require("../config/countries.json");
const {
  getProfiles,
  getCurrentUserProfile,
  updateProfile,
  updateProfileVisibility,
  verifySummonerProfile,
  unlinkSummonerProfile
} = require("../controllers/profile");

router
  .route("/")
  .get(getProfiles)
  .put(
    [
      auth,
      [
        check("dob")
          .not()
          .isEmpty()
          .matches(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
          .withMessage("Date of birth needs to be a valid date."),
        check("nationality")
          .exists()
          .isIn(countriesData.map(country => country.name))
          .withMessage("Nationality is required."),
        check("gender")
          .exists()
          .isIn(["male", "female"])
          .withMessage("Please select correct gender."),
        check("discordName").exists(),
        check("primaryRole")
          .exists()
          .isIn(["ADC", "MID", "TOP", "SUPP", "JNG"])
          .withMessage("Please select your primary role."),
        check("secondaryRole")
          .exists()
          .isIn(["ADC", "MID", "TOP", "SUPP", "JNG"])
          .withMessage("Please select your secondary role.")
      ]
    ],
    updateProfile
  );

router.route("/verify").post(
  [
    auth,
    [
      check("summonerName")
        .not()
        .isEmpty()
        .withMessage("Please provide summoner name."),
      check("summonerRegion")
        .exists()
        .isIn(["Not Selected", "ru", "kr", "br1", "oc1", "jp1", "na1", "eun1", "euw1", "tr1", "la1", "la2"])
        .withMessage("Please provide correct summoner region.")
    ]
  ],
  verifySummonerProfile
);

router.route("/unverify").get(auth, unlinkSummonerProfile);

router.route("/visibility").put([auth, [check("profileVisibility").isBoolean()]], updateProfileVisibility);

router.route("/me").get(auth, getCurrentUserProfile);

module.exports = router;
