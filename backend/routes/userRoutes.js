const express = require("express");

const authController = require("./../controllers/authController");

const auth = require("../middlewares/auth-middleware");

const router = express.Router();

//route level middleware to protect the protected routes

// router.use("/loggeduser", checUserAuth.CheckUserAuthLogin);

//User Routes

router.get("/home", authController.home);

router.get("/signup", authController.getSignup);

//Public routes--->

router.get("/login", authController.getLogin);

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.get("/loggeduser", authController.loggedUser);

router.get("/profile", auth.auth, authController.profile);

// router.get("/test", (req, res, next) => {
//   res.render("middleprofile");
// });

router.get("/profile/logout", auth.auth, async (req, res, next) => {
  try {
    console.log(req.user.tokens);

    req.user.tokens = req.user.tokens.filter((currToken) => {
      return currToken.token != req.token;
    });
    res.clearCookie("auth");
    await req.user.save();
    req.user.tokens;

    res.render("logout");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
