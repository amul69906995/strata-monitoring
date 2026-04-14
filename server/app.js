const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const Instrument = require('./model/instrument')
const Value = require('./model/value')
const Panel = require('./model/panel')
const multer = require('multer')
const getInstrumentConversion = require('./utils/conversion');
const upload = multer({ dest: 'uploads/' })
const { processAFile } = require('./utils/processFile')
//mongoose connection
const mongoose = require('mongoose');
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

main().then(() => {
  console.log('Connected to MongoDB')
})
  .catch(err => console.log(err));
//cors
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//endpoint
//get all the instrument
app.get('/', async (req, res) => {
  // get all instrument based on filter
  try {
    const allInstruments = await Instrument.find({})
    res.json(allInstruments)
  }
  catch (e) {
    console.log(e)
  }

})
//create a new instrument
app.post('/', async (req, res) => {
  try {
    const { instrumentName, instrumentId, panelNumber, maxValue, minValue, description, xCoordinate, yCoordinate } = req.body;
    const fullFormUnit = getInstrumentConversion(instrumentName);
    const newInstrument = new Instrument({ instrumentName, unit: fullFormUnit.unit, instrumentId, panelNumber, maxValue, minValue, description, xCoordinate, yCoordinate })
    console.log(newInstrument)
    await newInstrument.save()
    res.json({ newInstrument })
  }
  catch (err) {
    console.log(err)
  }
})
//get all data about a instrument
app.get('/:instrumentId', async (req, res) => {
  //get data based on instrument id
  try {
    const { instrumentId } = req.params;
    const reqInstrument = await Instrument.find({ instrumentId })
    const reqInstrumentValues = await Value.find({ owner: reqInstrument[0]._id });
    //console.log(reqInstrument, reqInstrumentValues)
    const newreqInstrumentValues = reqInstrumentValues.map((d) => ({
      time: d.time,
      value: d.value,
      maxValue: reqInstrument[0].maxValue,
      minValue: reqInstrument[0].minValue
    })
    )
    const sortedData = newreqInstrumentValues.sort((a, b) => new Date(a.time) - new Date(b.time));
    res.json(sortedData)
  } catch (e) {
    console.log(e)
  }
})

//add a instrument value
app.post('/:instrumentId', async (req, res, next) => {
  try {
    const { instrumentId } = req.params;
    const reqInstrument = await Instrument.find({ instrumentId });

    console.log("required instrument", reqInstrument);
    if (reqInstrument.length == 0) {
      throw new Error('instrument not found', 500)
    }
    const { value } = req.body;
    const newValue = new Value({ value, time: Date.now(), owner: reqInstrument[0]._id });
    await newValue.save();
    res.json(newValue)
  } catch (e) {
    next(e);

  }
})
//get all instrument in a panel number
app.get('/instruments/:panelNumber', async (req, res) => {
  try {
    const allInstrument = await Instrument.find({ panelNumber: req.params.panelNumber });
    res.json(allInstrument)
  }
  catch (err) {
    console.log(err)
  }
})
//save panel data
app.post('/upload/panel', upload.single('file'), async (req, res, next) => {
  console.log('Received request to upload panel data');
  const email = req.body.email;

  console.log(req.body)

  const allowedEmails = ["abbyynic@gmail.com"];

  if (!allowedEmails.includes(email)) {
    return res.status(403).json({ message: "Not authorized" });
  }
  try {
    console.log('Received file:', req.file);
    const panelData = await processAFile(req.file.path);
    console.log('Processed panel data:', panelData);
    const newPanel = new Panel(panelData)
    await newPanel.save()
    console.log('Panel saved successfully');
    res.json({ "message": "file uploaded successfully" })
  } catch (err) {
    console.log('Error in upload:', err);
    next(err)
  }
})
//get all panels
app.get('/all/panel', async (req, res, next) => {
  try {
    const panels = await Panel.aggregate([
      { $sort: { panelNumber: 1, date: 1 } },
      {
        $group: {
          _id: "$panelNumber",
          description: { $first: "$notes" },
          snapshots: { $sum: 1 },
          dates: { $push: "$date" }
        }
      },
      {
        $addFields: {
          panelNumber: "$_id"
        }
      },
      { $sort: { panelNumber: 1 } }
    ]);
    //console.log("all panels...", panels)
    const panelWithInstruments = await Promise.all(
      panels.map(async (panel) => {
        const instruments = await Instrument.find(
          { panelNumber: panel.panelNumber },
          {
            _id: 0,
            instrumentId: 1,
            instrumentName: 1,
            description: 1,
            xCoordinate: 1,
            yCoordinate: 1
          }
        );

        return {
          ...panel,
          instruments
        };
      })
    );
    //console.log("panel with instruments", panelWithInstruments)
    res.json(panelWithInstruments);
  } catch (e) {
    next(e);
  }
});
app.get('/panel/data/:panelNumber', async (req, res, next) => {
  try {
    const panelNumber = parseInt(req.params.panelNumber);

    if (!panelNumber) {
      return res.status(400).json({ message: "Invalid panel number" });
    }

    const panelSnapshots = await Panel.find({ panelNumber })
      .sort({ date: 1 });
    if (panelSnapshots.lenght == 0) {
      return res.status(400).json({ message: " panel not found" });
    }
    console.log("panelsnapshot.......", panelSnapshots)
    res.json(panelSnapshots);
  } catch (err) {
    next(err);
  }
})
app.use('*', (req, res) => {
  throw new Error('route not found', 404)
})

app.use((err, req, res, next) => {
  const { message = "something went wrong/default message to debug u have to dig dipper", statusCode = 500 } = err
  console.log("**********error**************")
  console.log("**********error**************")
  console.log(message, statusCode)
  console.log("**********error**************")
  console.log("**********error**************")
  res.status(statusCode).json({ message })
})


//listening or starting the server
app.listen(process.env.PORT || 6000, () => {
  console.log(`starting the server successfully on port`)
})