const mmongoose = require("mongoose");

const Pillar = require("../models/boardModel");
const History = require("../models/historyModel");
const authController = require("./../controllers/authController");

exports.getBoard = async (req, res, next) => {
  let pannelNumber = req.params.pannelNumber;
  // console.log("this is pannel number", pannelNumber);
  console.log(pannelNumber);
  try {
    let requiredPillarData = await Pillar.findOne({
      "pannel.pannelNumber": Number(pannelNumber),
    });

    console.log("required PillarData", requiredPillarData);

    res.render("index", { requiredPillarData });
  } catch (err) {
    console.log(err);
  }
};

exports.getBoardUpdate = async (req, res, next) => {
  let pannelNumber = req.params.pannelNumber;
  let currentIndex = req.query.currentIndex;
  if (!currentIndex) {
    currentIndex = 0;
  }
  // console.log("this is pannel number", pannelNumber);
  console.log(pannelNumber);
  try {
    let requiredPillarData = await History.find({
      "pannel.pannelNumber": Number(pannelNumber),
    });

    console.log("required PillarData", requiredPillarData);

    res.render("updateBoardView", { requiredPillarData, currentIndex });
  } catch (err) {
    console.log(err);
  }
};
