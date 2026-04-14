const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
  produit:    { type: mongoose.Schema.Types.ObjectId, ref: 'Produit',  required: true },
  acheteur:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
  transporteur:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'    },
  adresseLivraison: { type: String, required: true },
  statut: {
    type: String,
    enum: ['en_attente', 'confirme', 'en_cours', 'livre', 'annule'],
    default: 'en_attente'
  },
  quantite:    { type: Number, required: true, min: 1 },
  prixTotal:   { type: Number, required: true },
  date:        { type: Date, default: Date.now },
  dateLivraison:{ type: Date }
});

module.exports = mongoose.model('Livraison', livraisonSchema);