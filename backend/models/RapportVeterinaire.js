const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
  veterinaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agriculteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  animal:      { type: String, required: true },
  description: { type: String, required: true },
  diagnostic:  { type: String },
  traitement:  { type: String },
  urgence:     { type: Boolean, default: false },
  date:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('RapportVeterinaire', rapportSchema);