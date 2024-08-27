//importing file env

// import dotenv from "dotenv";
// dotenv.config();

///////---------------/////////

///impoting express

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require('morgan')
///////////-----------//////////////
morgan('tiny')
///using cor for fixing the error

const cors = require("cors");
const notifier = require("node-notifier");

/////////----------///////////

const path = require("path");
const ejsMate = require("ejs-mate");

const app = express();
app.use(cookieParser());
const boardRouter = require("./routes/boardRoutes");
const userRouter = require("./routes/userRoutes");
const mongoose = require("mongoose");
const Pillar = require("./models/boardModel");
const History = require("./models/historyModel.js");
const auth = require("./middlewares/auth-middleware");
// const AppError = require("./utils/appError");
// const globalErrorHandler = require("./controllers/errorController");
// var bodyParser = require('body-parser');
// app.use(express.json());
// const morgan = require("morgan");

mongoose.connect("mongodb://127.0.0.1:27017/project", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
//MIDDLEWARES//////////////////////
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

/////////////////////////////////////

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));
app.use("/project/users", userRouter);

app.use("/project", boardRouter);

/////////////////////////////////////////////////////////////////
// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.listen("3000", () => {
//   console.log("listening on http://localhost");
// });
//////////////////////////////////////////////////////////////////

//File upload part
////////////--------------------------->>>>>>>>>>>>>>>>>>>
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.post(
  "/upload",
  upload.single("file"),
  auth.auth,
  async function (req, res, next) {
    // req.body contains the text fields
    let pannelNumber = req.body.panel_number;
    // console.log(req.file);
    let newPath = req.file.path;

    if (!req.file || !pannelNumber) {
      setTimeout(function () {
        notifier.notify({
          title: "please choose file ",
          message: "choose file",
        });
      }, 1000);

      res.redirect("/project/users/profile");
    } else {
      fs.readFile(newPath, "utf8", async function (err, data) {
        if (err) {
          console.error("Error reading file:", err);
          res.status(500).send("Error reading the uploaded file");
        } else {
          try {
            const objectFile = JSON.parse(data);

            if (objectFile.pannelNumber) {
              objectFile.pannelNumber = pannelNumber;
            } else {
              objectFile.pannelNumber = pannelNumber;
            }
            const isPannelAvailable = await Pillar.find({ pannelNumber });
            console.log(isPannelAvailable);
            if (isPannelAvailable.length === 0) {
              let finalPannelObject =new Pillar({ pannel: objectFile });
              console.log("this is object file", objectFile);
              console.log(finalPannelObject);
              await finalPannelObject.save();
              let newhistory =new History({ pannel: objectFile });
              await newhistory.save();
            } else {
              res.json({ error: "pannel already exist" });
            }
            res.render("fileUploaded");
          } catch (error) {
            console.error("Error processing file:", error);
            res.status(500).send("Error processing the file");
          }
        }
      });
    }
  }
);

////-------------------------------------->>>>>
///pannel view

let pannelObject;
app.get("/view/pannel", auth.auth, (req, res) => {
  res.render("pannelList");
});

app.post("/view/pannel", async (req, res) => {
  try {
    let { pannelNumber } = req.body;
    console.log(pannelNumber);

    let pannelObject = await Pillar.findOne({
      "pannel.pannelNo": pannelNumber,
    });

    // if (pannelObject) {
    //   res.json({ pannelObject });
    // }
    if (pannelObject) {
      res.redirect(`/project/board/${pannelNumber}`);
    }
    console.log(pannelObject);
  } catch (error) {
    console.error("Error finding pannel object:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

///-------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

app.get("/view/pannel/edit", auth.auth, (req, res) => {
  res.render("edit");
});

app.post("/view/pannel/edit", async (req, res) => {
  console.log(req.body);
  // panel number pillar number, length ,width ,angle
  let { pillarNumber, pannelNumber, splitGallery, length, width, angle } =
    req.body;

  console.log(splitGallery);

  console.log(req.body);
  // findindg required pillar if it exist or not
  let pannelObject = await Pillar.findOne({
    $and: [
      { "pannel.pannelNumber": parseInt(pannelNumber) },
      { "pannel.Pillar.pillarNumber": parseInt(pillarNumber) },
    ],
  });
  //console.log(pannelObject);

  if (!pannelObject) {
    res.json({ failure: "pillar/pannel doesnot exist" });
  }

  let pillarArray = pannelObject.pannel.Pillar;
  // console.log(pillarArray);
  let pillarToEdit;

  for (let i = 0; i < pillarArray.length; i++) {
    if (pillarArray[i].pillarNumber == parseInt(pillarNumber)) {
      pillarToEdit = pillarArray[i];
    }
  }

  console.log("this is the pillar");
  console.log(pillarToEdit);
  //checking if that particular stook available or not

  const stookExists = pillarToEdit.stook.some(
    (stook) => stook.stookNumber === parseInt(splitGallery)
  );
  if (stookExists) {
    // Pillar with the given pillarNumber exists and stookNumber is available
    console.log("stook exists");
    console.log(stook);
  } else {
    // Stook with the given stookNumber does not exist
    console.log("stook not available");
  }

  //stook associated with that pillar
  console.log(pillarToEdit.stook);
  let splitGalleryArray = pillarToEdit.stook;
  //mid point  of pillars to edit
  const midx_0_3 =
    (pillarToEdit.coordinates[0].x + pillarToEdit.coordinates[3].x) / 2;
  const midy_0_3 =
    (pillarToEdit.coordinates[0].y + pillarToEdit.coordinates[3].y) / 2;
  const midx_1_2 =
    (pillarToEdit.coordinates[1].x + pillarToEdit.coordinates[2].x) / 2;
  const midy_1_2 =
    (pillarToEdit.coordinates[1].y + pillarToEdit.coordinates[2].y) / 2;
  const midx_0_1 =
    (pillarToEdit.coordinates[0].x + pillarToEdit.coordinates[1].x) / 2;
  const midy_0_1 =
    (pillarToEdit.coordinates[0].y + pillarToEdit.coordinates[1].y) / 2;
  const midx_2_3 =
    (pillarToEdit.coordinates[2].x + pillarToEdit.coordinates[3].x) / 2;
  const midy_3_3 =
    (pillarToEdit.coordinates[2].y + pillarToEdit.coordinates[3].y) / 2;

  ///the length for horizonatal and split gallery 1st

  let lengthX = pillarToEdit.coordinates[1].x - pillarToEdit.coordinates[0].x;
  let lengthY = pillarToEdit.coordinates[3].y - pillarToEdit.coordinates[0].y;

  console.log(lengthX, lengthY);

  // finding stook if exist or not then making split gallery
  if (splitGallery == 1) {
    let newSplitCoordinates = [];
    newSplitCoordinates.push(
      {
        x: midx_0_3,
        y: midy_0_3 + width / 2,
      },
      {
        x: parseInt(midx_0_3) + lengthX,
        y: midy_0_3 + width / 2,
      },
      {
        x: parseInt(midx_0_3) + lengthX,
        y: midy_0_3 - width / 2,
      },
      {
        x: midx_0_3,
        y: midy_0_3 - width / 2,
      }
    );
    console.log(newSplitCoordinates);
    let newSplitGallery = { stookNumber: 1, coordinates: newSplitCoordinates };
    pillarToEdit.stook.push(newSplitGallery);

    console.log(pannelObject);
    // Convert Mongoose document to plain JavaScript object
    let plainObject = pannelObject.toObject();

    // Remove the _id field from the plain JavaScript object
    delete plainObject._id;

    // Now you can save the modified object to the database
    let newHistory = await new History(plainObject);
    await newHistory
      .save()
      .then((savedHistory) => {
        console.log("History saved successfully:", savedHistory);
      })
      .catch((error) => {
        console.error("Error saving history:", error);
      });

    res.json({ pannelObject });
  } else if (splitGallery == 2) {
    let newSplitCoordinates2 = [];
    newSplitCoordinates2.push(
      {
        x: midx_0_1 + width / 2,
        y: midy_0_1,
      },
      {
        x: parseInt(midx_0_1) + width / 2,
        y: midy_0_1 + lengthY,
      },
      {
        x: parseInt(midx_0_1) - width / 2,
        y: midy_0_1 + lengthY,
      },
      {
        x: parseInt(midx_0_1) - width / 2,
        y: midy_0_1,
      }
    );
    console.log(newSplitCoordinates2);
    let newSplitGallery = { stookNumber: 2, coordinates: newSplitCoordinates2 };
    pillarToEdit.stook.push(newSplitGallery);

    console.log(pannelObject);
    // Convert Mongoose document to plain JavaScript object
    let plainObject = pannelObject.toObject();

    // Remove the _id field from the plain JavaScript object
    delete plainObject._id;

    // Now you can save the modified object to the database
    let newHistory = await new History(plainObject);
    await newHistory
      .save()
      .then((savedHistory) => {
        console.log("History saved successfully:", savedHistory);
      })
      .catch((error) => {
        console.error("Error saving history:", error);
      });

    res.json({ pannelObject });
  } else {
    //we will make horizontal split gallery
  }

  //console.log(requiredStook, stookNumber);
  // function calculateSine(angleInDegrees, multiplier) {
  //   // Convert degrees to radians
  //   let angleInRadians = (angleInDegrees * Math.PI) / 180;

  //   // Calculate sine
  //   let sineValue = Math.sin(angleInRadians);

  //   // Multiply by the multiplier
  //   let result = multiplier * sineValue;

  //   return result;
  // }

  // function calculateCosine(angleInDegrees, multiplier) {
  //   // Convert degrees to radians
  //   let angleInRadians = (angleInDegrees * Math.PI) / 180;

  //   // Calculate cosine
  //   let cosineValue = Math.cos(angleInRadians);

  //   // Multiply by the multiplier
  //   let result = multiplier * cosineValue;

  //   return result;
  // }
  // if (splitGallery.length == 0) {
  //   //central split gallery
  //   const midx_0_3 =
  //     (pillarToEdit.coordinates[0].x + pillarToEdit.coordinates[3].x) / 2;
  //   const midy_0_3 =
  //     (pillarToEdit.coordinates[0].y + pillarToEdit.coordinates[3].y) / 2;
  //   const midx_1_2 =
  //     (pillarToEdit.coordinates[1].x + pillarToEdit.coordinates[2].x) / 2;
  //   const midy_1_2 =
  //     (pillarToEdit.coordinates[1].y + pillarToEdit.coordinates[2].y) / 2;

  //   let newStookCoordinates = [];

  //   newStookCoordinates.push({
  //     x: pillarToEdit.coordinates[0].x,
  //     y: pillarToEdit.coordinates[0].y + width / 2,
  //   });
  //   newStookCoordinates.push({
  //     x: pillarToEdit.coordinates[0].x + length,
  //     y: pillarToEdit.coordinates[0].y + width / 2,
  //   });
  //   newStookCoordinates.push({
  //     x: pillarToEdit.coordinates[0].x + length,
  //     y:
  //       pillarToEdit.coordinates[0].y -
  //       width / 2 +
  //       calculateSine(angle, length),
  //   });

  //   newStookCoordinates.push({
  //     x: pillarToEdit.coordinates[0].x,
  //     y: pillarToEdit.coordinates[0].y - width / 2,
  //   });
  //   console.log("newStookCoordinates", newStookCoordinates);
  //   pillarToEdit.stook.push(newStookCoordinates);
  //   console.log("this is new stook ");
  //   console.log(pillarToEdit.stook);
  //   res.redirect(`/project/board/${pannelNumber}`);
  // }
  // if (requiredStook) {
  //   res.json({ requiredStook });
  // }
});

//////--------------------------------->>>>>>>>>>>>>>>>>>>>>>>

module.exports = { app, pannelObject };

// const boardSchema = new mongoose.Schema({
//   pannel: {
//     pannelNo: { type: Number },
//     Pillar: [
//       {
//         name: { type: String },
//         cordinates: [{ x: { type: Number }, y: { type: Number } }],
//         status: { type: String },
//       },
//     ],
//   },
// });
