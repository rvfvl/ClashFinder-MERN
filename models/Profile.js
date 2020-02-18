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
    profileVisibility: { type: Boolean, default: false }
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

ProfileSchema.virtual("summonerProfile", {
  ref: "SummonerProfile",
  localField: "_id",
  foreignField: "profileId",
  justOne: true
});

module.exports = mongoose.model("Profile", ProfileSchema);
