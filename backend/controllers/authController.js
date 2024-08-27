const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("./../models/userModel");
var cookieParser = require("cookie-parser");

let alert = require("alert");
const notifier = require("node-notifier");
const Pillar = require("../models/boardModel.js");
//function for creating jwt token for user login

const key = "secret";
const signToken = (id) => {
  return jwt.sign({ id: id }, key, { expiresIn: "5d" });
};

////----------------------------/////

//signup page --->
exports.getSignup = (req, res, next) => {
  res.render("signup");
};
//login page----->
exports.getLogin = (req, res, next) => {
  res.render("login");
};
////home page --->
exports.home = (req, res, next) => {
  res.render("home");
};

///signup page ---->
exports.signup = async (req, res, next) => {
  //destrutring of req.body means data
  const { name, email, password, confirmPassword } = req.body;
  ////------------//////

  /////---checking if user already exist of same email
  const foundUser = await User.findOne({ email: email });

  if (foundUser) {
    res.render("alreadyregistered");
  } else {
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          let newUser = new User({
            name: name,
            email: email,
            password: hashPassword,
          });

          const token = await newUser.generateAuthToken();

          // console.log(token);
          const registered = await newUser.save();
          // console.log(registered);

          //---------------------->
          // await newUser.save();
          // console.log(newUser);
          //---------------------->

          // const token = signToken(newUser._id);

          // // const finalUser = await User.updateOne(
          // //   { _id: newUser._id },
          // //   { $set: { tokens: [{ token: token }] } }
          // // );

          // newUser.tokens.token = token;

          // console.log(newUser);

          //////--->
          //storing jwt in cookie
          res.cookie("auth", token, { httpOnly: true });
          const data = await Pillar.find({});
          console.log(data);

          res.render("middleProfile", { data, user: newUser });

          // res.render("middleProfile");
        } catch (error) {
          console.log(error);
          console.log("something went wrong ");
        }
      } else {
        console.log("password and confirm password are different ");

        setTimeout(function () {
          notifier.notify({
            title: "Check Carefully",
            message: "Password and confirm password are not same",
          });
          res.render("signup");
        }, 1000);
      }
    } else {
      console.log("please fill all fields");
      setTimeout(function () {
        notifier.notify({
          title: "Missing information",
          message: "please fill all the fields",
        });
        res.render("signup");
      }, 1000);
    }
  }
};

///login page ----->

//function to compare the password from login form and hash password available in the database
const correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//------//

//Login kaa functuon ------>
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Need to check if email and password exist
  if (!email || !password) {
    // return the dialougue box that please fill all the detials box
    //and then reupdate the page
    console.log("missing credentials ");
    setTimeout(function () {
      notifier.notify({
        title: "Missing Credentials",
        message: "please fill all the fields",
      });
      res.render("login");
    }, 1000);
  } else {
    const user = await User.findOne({ email: email }).select("+password");
    const checkPaassword = await bcrypt.hash(password, 12);
    console.log(checkPaassword);
    // const Correct = await User.CorrectPassword(password, user.password);

    if (!user || !(await correctPassword(password, user.password))) {
      setTimeout(function () {
        notifier.notify({
          title: "Wrong credentials",
          message: "Please check your email or password ",
        });
        res.render("login");
      }, 1000);
    } else {
      //creatiing jwt tokem using function of jwt and now we can send success mesaage that user is logined successfully.
      const token = await user.generateAuthToken();
      console.log(token);

      res.cookie("auth", token, { httpOnly: true });

      setTimeout(function () {
        notifier.notify({
          title: "Welcome you logined succefully",
          message: "successfully logined ",
        });
      }, 1000);
      // requiring pillar data

      const data = await Pillar.find({});
      console.log(data);

      res.render("middleProfile", { data, user });
    }
  }
};

exports.profile = (req, res, next) => {
  const user = req.user;
  console.log(user);
  // const email = user.email;

  if (user.role == "staff") {
    res.json({ message: "unauthorized" });
  } else if (user.role == "manager") {
    res.render("manager", { user });
  }
  // console.log(req.cookies);
};
// exports.changePassword = async (res, req, next) => {};

exports.loggedUser = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  res.send(user);
};

exports.forgotPassword = (req, res, next) => {};
