const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true, immutable: true },
    dob: { type: String, default: "Not specified" },
    nationality: { type: String, default: "Not specified", required: [true, "Nationality is required."] },
    gender: {
      type: String,
      enum: ["Not specified", "Male", "Female"],
      default: "Not specified"
    },
    discordName: String,
    primaryRole: {
      type: String,
      enum: ["Not specified", "ADC", "MID", "TOP", "SUPP", "JNG"],
      default: "Not specified"
    },
    secondaryRole: {
      type: String,
      enum: ["Not specified", "ADC", "MID", "TOP", "SUPP", "JNG"],
      default: "Not specified"
    },
    profileVisibility: { type: Boolean, default: true },
    summonerProfile: {
      summonerVerified: { type: Boolean, default: false },
      summonerName: { type: String, default: "" },
      summonerRegion: {
        type: String,
        enum: ["ru", "kr", "br1", "oc1", "jp1", "na1", "eun1", "euw1", "tr1", "la1", "la2"],
        default: "ru"
      },
      summonerRank: {
        tier: { type: String, default: "Unranked" },
        rank: { type: String, default: "" },
        tierValue: { type: Number, default: 0 }
      }
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

// ProfileSchema.virtual("summonerProfile", {
//   ref: "SummonerProfile",
//   localField: "_id",
//   foreignField: "profileId",
//   justOne: true
// });

module.exports = mongoose.model("Profile", ProfileSchema);
