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
    const profile = await Profile.findOne({ userId: req.user.id });

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
    let query = {};

    if (req.query.region) {
      query["summonerProfile.summonerRegion"] = { $eq: req.query.region };
    }

    if (req.query.nationality) {
      query["nationality"] = req.query.nationality;
    }

    if (req.query.roles) {
      const roles = req.query.roles.split(",");

      query["$or"] = [{ primaryRole: { $in: roles } }, { secondaryRole: { $in: roles } }];
    }

    if (req.query.minRank && req.query.maxRank) {
      query["$and"] = [
        { "summonerProfile.summonerRank.tierValue": { $gte: parseInt(req.query.minRank, 10) } },
        { "summonerProfile.summonerRank.tierValue": { $lte: parseInt(req.query.maxRank, 10) } }
      ];
    }

    if (req.query.minRank) {
      query["summonerProfile.summonerRank.tierValue"] = { $gte: parseInt(req.query.minRank, 10) };
    }

    if (req.query.maxRank) {
      query["summonerProfile.summonerRank.tierValue"] = { $lte: parseInt(req.query.maxRank, 10) };
    }

    const profiles = await Profile.find({
      profileVisibility: true,
      "summonerProfile.summonerVerified": true,
      ...query
    }).select("-userId -dob");

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
    const profile = await Profile.findOne({ userId: req.user.id, "summonerProfile.summonerVerified": false });

    if (!profile) {
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

          console.log(rank);

          const filterLeague = rank.filter(league => league.queueType === "RANKED_SOLO_5x5");

          const updatedProfile = await Profile.findOneAndUpdate(
            { userId: req.user.id },
            {
              "summonerProfile.summonerVerified": true,
              "summonerProfile.summonerName": summonerName,
              "summonerProfile.summonerRegion": summonerRegion,
              "summonerProfile.summonerRank.tier": filterLeague[0].tier || "Unranked",
              "summonerProfile.summonerRank.tierValue": getRankValue(filterLeague[0].tier || ""),
              "summonerProfile.summonerRank.rank": filterLeague[0].rank
            },
            { new: true }
          );

          res.json(updatedProfile);
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
    const profile = await Profile.findOne({ userId: req.user.id, "summonerProfile.summonerVerified": true });

    if (!profile) {
      return res.status(400).json({ success: false, errors: { msg: "Could not find a profile for this user." } });
    }

    await profile.updateOne({ "summonerProfile.summonerVerified": false }, { new: true });

    res.json({ success: true, msg: "Profile succesfuly unlinked." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};
