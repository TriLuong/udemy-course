const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    role: String,
    name: String,
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error("Email is invalid!");
      //   }
      // }
    },
    password: String,
    phone: String,
    role: String,
    truck: String,
    available: String,
    note: String,
    truckNumber: String,
    token: String
  },
  {
    timestamps: true
  }
);

userSchema.virtual("loads", {
  ref: "Loads",
  localField: "_id",
  foreignField: "driver"
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "udemy-nodejs", {
    expiresIn: "2 days"
  });
  user.token = token;
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
