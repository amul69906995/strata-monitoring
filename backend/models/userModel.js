const mongoose = require("mongoose");

const nodemailer = require("nodemailer");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const key = "secret";
const UserScehma = new mongoose.Schema({
  name: { type: "string", required: "true" },
  email: {
    type: "string",
    required: true,
    trim: true,
  },
  password: { type: String },
  confirmmPassword: {
    typeof: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  role: { type: String, default: "staff" },
});

UserScehma.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign({ _id: this._id.toString() }, key);
    console.log(token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("User", UserScehma);

module.exports = User;
