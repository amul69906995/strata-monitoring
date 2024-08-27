const express = require("express");

const Boards = require("./../controllers/boardController");

const authController = require("./../controllers/authController");
const auth = require("../middlewares/auth-middleware");

//User Routes

const router = express.Router();

router.get("/board/:pannelNumber", auth.auth, Boards.getBoard);
router.get("/board/:pannelNumber/update", Boards.getBoardUpdate);

module.exports = router;
