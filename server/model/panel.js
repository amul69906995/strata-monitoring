const mongoose = require('mongoose');

const pillarSchema = new mongoose.Schema({
  pillarNumber: { type: Number, required: true },
  coordinates: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['intact', 'extracted', 'failed','active'],
    default: 'intact'
  }
}, { _id: false });

const panelSchema = new mongoose.Schema({
  panelNumber: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  panelStatus: {
    type: String,
    enum: ['working', 'completed', 'inactive' , 'active'],
    default: 'working'
  },
  pillars: [pillarSchema],
  instrumentIds: [
    {
      type: String
    }
  ],
  notes: { type: String, maxlength: 1000 }
});
panelSchema.index({ panelNumber: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Panel', panelSchema);
