const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire'],
    trim: true
  },
  description: { type: String, required: true },
  prix:        { type: Number, required: true, min: 0 },
  quantite:    { type: Number, required: true, min: 0 },
  categorie: {
    type: String,
    enum: ['culture', 'engrais', 'materiel', 'semences', 'phytosanitaire'],
    required: true
  },
  image:       { type: String, default: '' },
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produit', produitSchema);