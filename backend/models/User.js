// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type:     String,
    required: [true, 'Le nom est obligatoire'],
    trim:     true,
  },
  email: {
    type:      String,
    required:  [true, 'Email obligatoire'],
    unique:    true,
    lowercase: true,
    trim:      true,
  },
  motDePasse: {
    type:      String,
    required:  [true, 'Mot de passe obligatoire'],
    minlength: 6,
    select:    false,
  },
  cin: {
    type:    String,
    default: '',
    validate: {
      validator: function(v) {
        if (!v || v === '') return true;
        return /^\d{8}$/.test(v);
      },
      message: 'CIN invalide — 8 chiffres requis',
    },
  },
  role: {
    type:    String,
    enum:    ['admin', 'agriculteur', 'fournisseur', 'veterinaire', 'transporteur'],
    default: 'agriculteur',
  },
  telephone:    { type: String, default: '' },
  adresse:      { type: String, default: '' },
  isActive:     { type: Boolean, default: true },
  dateCreation: { type: Date,    default: Date.now },

  // ── Réinitialisation mot de passe ──────────────────────────────────────
  resetCode:       { type: String, select: false },   // code hashé
  resetCodeExpire: { type: Date,   select: false },   // expiration 15 min
});

// Hash mot de passe avant sauvegarde
userSchema.pre('save', async function () {
  if (!this.isModified('motDePasse')) return;
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Vérifier mot de passe
userSchema.methods.verifierMotDePasse = async function (saisi) {
  return await bcrypt.compare(saisi, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);