const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 150,
    },
    userName: {
      type: String,
      trim: true,
      required: true,
      unique: [true, 'invalid userName try another one ...'], // Custom message for unique validation
      max: 255,
    },
    password: {
      type: String,
      required: true,
    },
    img: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  } catch (err) {
    next(err);
  }
  next();
});

UserSchema.statics.isValidId = (id)=>{
  return mongoose.isValidObjectId(id)
}

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
