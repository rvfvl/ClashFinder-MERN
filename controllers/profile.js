const Profile = require("../models/Profile");
const SummonerProfile = require("../models/SummonerProfile");
const { validationResult } = require("express-validator");
const fetch = require("node-fetch");
const getRankValue = require("../utils/getRankValue");

// @Description - Get current user profile
// @Route - /api/v1/profile/me
// @Access - PUBLIC
exports.getCurrentUserProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate("summonerProfile");

    if (!profile) {
      return res.status(400).json({ success: false, errors: { msg: "Could not find a profile for this user." } });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};

// @Description - Get all profiles
// @Route - /api/v1/profile
// @Access - PUBLIC
exports.getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({
      profileVisibility: true
      //$or: [{ primaryRole: { $eq: "TOP" } }, { secondaryRole: { $eq: "MID" } }]
    })
      .select("-userId")
      .populate("summonerProfile", "summonerName summonerRegion summonerRank", {
        // "summonerRank.tierValue": { $gte: 5, $lte: 10 }
      });

    res.json({ count: profiles.length, profiles });
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};

// @Description - Update profile
// @Route - /api/v1/profile
// @Access - PRIVATE
exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { dob, nationality, gender, discordName, primaryRole, secondaryRole } = req.body;

  if (discordName !== "") {
    const isValidDiscordName = discordName.match(/^((.+?)#\d{4})/);

    if (!isValidDiscordName) {
      return res.status(400).json({ success: false, errors: { msg: "Incorrect Discord Name provided." } });
    }
  }

  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(400).json({ success: false, errors: { msg: "Profile for this person was not found." } });
    }

    await profile.update({ dob, nationality, gender, discordName, primaryRole, secondaryRole });

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};

// @Description - Set profile visibility
// @Route - /api/v1/profile/visiblity
// @Access - PRIVATE
exports.updateProfileVisibility = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { profileVisibility: req.body.profileVisibility } },
      {
        new: true
      }
    );

    if (!profile) {
      return res.status(400).json({ success: false, errors: { msg: "Could not find a profile for this user." } });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};

// @Description - Verify profile
// @Route - /api/v1/profile/verify
// @Access - PRIVATE
exports.verifySummonerProfile = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { summonerName, summonerRegion } = req.body;

  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    const summonerProfile = await SummonerProfile.findOne({ profileId: profile.id });

    if (summonerProfile) {
      return res.status(400).json({ success: false, msg: "Summoner is already verified." });
    }

    try {
      const response = await fetch(
        `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(summonerName)}`,
        { headers: { "X-Riot-Token": process.env.RIOT_API_KEY } }
      );

      const summonerId = await response.json();

      try {
        const response = await fetch(
          `https://${summonerRegion}.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${summonerId.id}`,
          { headers: { "X-Riot-Token": process.env.RIOT_API_KEY } }
        );
        const partyCode = await response.json();

        if (partyCode !== String(req.user.id).substring(0, 8)) {
          return res.status(400).json({ success: false, errors: { msg: "Party code is not correct." } });
        }

        try {
          const response = await fetch(
            `https://${summonerRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId.id}`,
            { headers: { "X-Riot-Token": process.env.RIOT_API_KEY } }
          );
          const rank = await response.json();
          const filterLeague = rank.filter(league => league.queueType === "RANKED_SOLO_5x5");

          const verifiedProfile = new SummonerProfile({
            profileId: profile.id,
            userId: req.user.id,
            summonerName,
            summonerRegion,
            summonerRank: {
              tier: filterLeague[0].tier,
              tierValue: getRankValue(filterLeague[0].tier),
              rank: filterLeague[0].rank
            }
          });

          await verifiedProfile.save();

          res.json(verifiedProfile);
        } catch (error) {
          console.log(error.message);
          return res
            .status(400)
            .json({ success: false, errors: { msg: "Error while trying to fetch data from third party." } });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, errors: { msg: "Error while trying to fetch data from third party." } });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, errors: { msg: "Error while trying to fetch data from third party." } });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};

// @Description - Unlink Summoner Profile
// @Route - /api/v1/profile/unverify
// @Access - PRIVATE
exports.unlinkSummonerProfile = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const profile = await SummonerProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(400).json({ success: false, errors: { msg: "Could not find a profile for this user." } });
    }

    await profile.remove();

    res.json({ success: true, msg: "Profile succesfuly unlinked." });
  } catch (error) {
    res.status(500).json("Server Error");
  }
};
