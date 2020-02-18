const mongoose = require("mongoose");

const SummonerProfileSchema = mongoose.Schema({
  profileId: { type: mongoose.Schema.ObjectId, ref: "Profile", required: true, immutable: true },
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true, immutable: true },
  summonerName: { type: String, required: true },
  summonerRegion: {
    type: String,
    required: true,
    enum: ["ru", "kr", "br1", "oc1", "jp1", "na1", "eun1", "euw1", "tr1", "la1", "la2"]
  },
  summonerRank: {
    tier: String,
    rank: String,
    tierValue: Number
  }
});

module.exports = mongoose.model("SummonerProfile", SummonerProfileSchema);
