// backend/routes/auth.js — version corrigée et robuste
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/inscription ─────────────────────────────────────────────
router.post('/inscription', async (req, res) => {
  try {
    console.log('📥 Inscription :', req.body);

    const { nom, email, motDePasse, role, telephone, adresse, cin } = req.body;

    // Validation de base
    if (!nom || !nom.trim()) {
      return res.status(400).json({ success:false, message:'Le nom est obligatoire.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success:false, message:'L\'email est obligatoire.' });
    }
    if (!motDePasse || motDePasse.length < 6) {
      return res.status(400).json({ success:false, message:'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    // Vérif CIN si fourni
    if (cin && cin.trim() !== '' && !/^\d{8}$/.test(cin)) {
      return res.status(400).json({ success:false, message:'Le CIN doit contenir exactement 8 chiffres.' });
    }

    // Email déjà utilisé ?
    const existant = await User.findOne({ email: email.toLowerCase().trim() });
    if (existant) {
      return res.status(400).json({ success:false, message:'Un compte existe déjà avec cet email.' });
    }

    // Créer l'utilisateur
    const user = new User({
      nom:       nom.trim(),
      email:     email.toLowerCase().trim(),
      motDePasse,
      cin:       cin || '',
      role:      role || 'agriculteur',
      telephone: telephone || '',
      adresse:   adresse   || '',
    });

    await user.save();
    console.log('✅ Utilisateur créé :', user.email, '| rôle:', user.role);

    return res.status(201).json({
      success: true,
      token:   genToken(user._id),
      user: {
        id:    user._id,
        nom:   user.nom,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (err) {
    console.error('❌ Erreur inscription :', err.message);

    if (err.code === 11000) {
      return res.status(400).json({ success:false, message:'Email déjà utilisé.' });
    }
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ success:false, message: msgs });
    }
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// ── POST /api/auth/connexion ───────────────────────────────────────────────
router.post('/connexion', async (req, res) => {
  try {
    console.log('📥 Connexion :', req.body.email);

    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ success:false, message:'Email et mot de passe requis.' });
    }

    // Chercher l'utilisateur (avec motDePasse car select:false)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+motDePasse');

    if (!user) {
      console.log('❌ Utilisateur non trouvé :', email);
      return res.status(401).json({ success:false, message:'Email ou mot de passe incorrect.' });
    }

    const ok = await user.verifierMotDePasse(motDePasse);
    if (!ok) {
      console.log('❌ Mot de passe incorrect pour :', email);
      return res.status(401).json({ success:false, message:'Email ou mot de passe incorrect.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success:false, message:"Compte désactivé. Contactez l'administrateur." });
    }

    console.log('✅ Connexion réussie :', user.email, '| rôle:', user.role);

    return res.json({
      success: true,
      token:   genToken(user._id),
      user: {
        id:    user._id,
        nom:   user.nom,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (err) {
    console.error('❌ Erreur connexion :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// ── GET /api/auth/moi ──────────────────────────────────────────────────────
router.get('/moi', protect, (req, res) => {
  res.json({ success:true, user: req.user });
});

module.exports = router;