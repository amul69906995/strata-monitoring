const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
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
          },
        ],
        status: { type: String, default: "extracted" },
      },
    ],
    panelStatus: { type: String, default: "working" },
  },
});

const History = mongoose.model("History", historySchema);

module.exports = History;
