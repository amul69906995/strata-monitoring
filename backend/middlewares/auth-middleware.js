const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("./../models/userModel");

const key = "secret";

// exports.CheckUserAuthLogin = async (req, res, next) => {
//   const { authorization } = req.headers;
//   let token;

//   if (authorization && authorization.startsWith("Bearer")) {
//     try {
//       token = authorization.split(" ")[1];

//       // console.log(token);

//       //Verify token
//       const { id } = jwt.verify(token, key);
//       // console.log(id);

//       req.user = await User.findById(id);
//       const user = req.user;
//       // console.log(user.email, user.password);
//       return next();

//       //get user from token
//     } catch (err) {
//       res.status(404).send({
//         status: "Failed",
//         message: "unauthorized",
//       });

//       // console.log(err);
//     }
//   } else if (!token) {
//     res.status(404).send({
//       status: "Failed",
//       message: "No token is sent",
//     });
//   }
// };

// exports.checkUserLogin = (req, res, next) => {
//   res.render("profile");
// };

exports.auth = async (req, res, next) => {
  const token = req.cookies.auth;

  if (token) {
    try {
      // const userVerify = jwt.verify(token, key);
      //Verify token
      const { _id } = jwt.verify(token, key);
      console.log(_id);

      const user = await User.findById(_id);
      req.user = user;
      req.token = token;

      console.log(user.email, user.password);
      return next();
    } catch (err) {
      res.status(404).send({
        status: "Failed",
        message: "unauthorized",
      });
      // console.log(err);
    }
  } else if (!token) {
    res.status(404).send({
      status: "Failed",
      message: "No token is sent",
    });
  }
};

// try {
//   const token = req.cookies.auth;
//   const userVerify = jwt.verify(token, key);
//   //Verify token
//   const { id } = jwt.verify(token, key);
//   // console.log(id);
//   req.user = await User.findById(id);
//   const user = req.user;
//   // console.log(user.email, user.password);
//   return next();
// } catch (Err) {
//   console.log(Err);
// }
//     try {
//       token = authorization.split(" ")[1];
//       // console.log(token);
//       //Verify token
//       const { id } = jwt.verify(token, key);
//       // console.log(id);
//       req.user = await User.findById(id);
//       const user = req.user;
//       // console.log(user.email, user.password);
//       return next();
//       //get user from token
//     } catch (err) {
//       res.status(404).send({
//         status: "Failed",
//         message: "unauthorized",
//       });
//       // console.log(err);
//     }
//   } else if (!token) {
//     res.status(404).send({
//       status: "Failed",
//       message: "No token is sent",
//     });
//   }
