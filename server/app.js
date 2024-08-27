const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const Instrument = require('./model/instrument')
const Value = require('./model/value')
const getInstrumentConversion = require('./utils/conversion')
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
app.post('/:instrumentId', async (req, res) => {
  try {
    const { instrumentId } = req.params;
    const reqInstrument = await Instrument.find({ instrumentId });
    console.log(reqInstrument)
    const { value } = req.body;
    const newValue = new Value({ value, time: Date.now(), owner: reqInstrument[0]._id });
    await newValue.save();
    res.json(newValue)
  } catch (e) {
    console.log(e)
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
//listening or starting the server
app.listen(process.env.PORT || 6000, () => {
  console.log(`starting the server successfully on port`)
})