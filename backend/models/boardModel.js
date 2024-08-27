const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  pannel: {
    pannelNumber: { type: Number },
    Pillar: [
      {
        pillarNumber: { type: Number },
        coordinates: [{ x: { type: Number }, y: { type: Number } }],
        stook: [
          {
            stookNumber: { type: Number },
            coordinates: [{ x: { type: Number }, y: { type: Number } }],
            status: { type: String, defaultValue: "extracted" },
          },
        ],
        status: { type: String, defaultValue: "extracted" },
      },
    ],
    panelStatus: { type: String, defaultValue: "working" },
  },
});

const Pillar = mongoose.model("Pillar", boardSchema);

module.exports = Pillar;
