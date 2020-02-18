const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  email: { type: String, trim: true, lowercase: true, unique: true, required: true },
  password: { type: String, required: true }
});

UserSchema.pre("save", function(next) {
  if (this.password && this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);

    this.password = hash;
  }

  next();
});

module.exports = mongoose.model("User", UserSchema);
