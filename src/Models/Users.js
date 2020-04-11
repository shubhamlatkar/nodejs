const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Task = require("../Models/Task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate: value => {
        if (!validator.isEmail(value)) {
          throw new Error("not an email");
        }
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate: value => {
        if (value.toLowerCase().includes("password")) {
          throw new Error("should not contain word password");
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate: value => {
        if (value < 0) throw new Error("Negative");
      }
    },
    tokens: [
      {
        token: {
          type: String,
          require: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

userSchema.methods.toJSON = function() {
  let user = this;
  user = user.toObject();
  delete user.tokens;
  delete user.password;
  delete user.avatar;
  return user;
};

userSchema.methods.genrateAuthToken = async function(email, password) {
  const user = this;
  let token = jwt.sign({ _id: user._id.toString() }, "secretString");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  let user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid  credentials");

  return user;
};

userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
