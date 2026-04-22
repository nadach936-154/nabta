// backend/routes/auth.js
// ✅ VERSION COMPLÈTE avec toutes les routes nécessaires
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/inscription ────────────────────────────────────────────
router.post('/inscription', async (req, res) => {
  try {
    console.log('📥 Inscription :', req.body.email);
    const { nom, email, motDePasse, role, telephone, adresse, cin } = req.body;

    if (!nom?.trim())       return res.status(400).json({ success:false, message:'Le nom est obligatoire.' });
    if (!email?.trim())     return res.status(400).json({ success:false, message:"L'email est obligatoire." });
    if (!motDePasse || motDePasse.length < 6)
      return res.status(400).json({ success:false, message:'Mot de passe : minimum 6 caractères.' });

    if (cin && cin.trim() && !/^\d{8,9}$/.test(cin))
      return res.status(400).json({ success:false, message:'CIN invalide.' });

    const existant = await User.findOne({ email: email.toLowerCase().trim() });
    if (existant)
      return res.status(400).json({ success:false, message:'Un compte existe déjà avec cet email.' });

    const user = await new User({
      nom:       nom.trim(),
      email:     email.toLowerCase().trim(),
      motDePasse,
      cin:       cin || '',
      role:      role || 'agriculteur',
      telephone: telephone || '',
      adresse:   adresse || '',
    }).save();

    console.log('✅ Créé :', user.email, '|', user.role);
    return res.status(201).json({
      success: true,
      token:   genToken(user._id),
      user:    { id: user._id, nom: user.nom, email: user.email, role: user.role, telephone: user.telephone, adresse: user.adresse },
    });
  } catch (err) {
    console.error('❌ Inscription :', err.message);
    if (err.code === 11000) return res.status(400).json({ success:false, message:'Email déjà utilisé.' });
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ success:false, message: msgs });
    }
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// ── POST /api/auth/connexion ──────────────────────────────────────────────
router.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    console.log('📥 Connexion :', email);

    if (!email || !motDePasse)
      return res.status(400).json({ success:false, message:'Email et mot de passe requis.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+motDePasse');
    if (!user) {
      console.log('❌ Non trouvé :', email);
      return res.status(401).json({ success:false, message:'Email ou mot de passe incorrect.' });
    }

    const ok = await user.verifierMotDePasse(motDePasse);
    if (!ok) {
      console.log('❌ Mauvais mdp :', email);
      return res.status(401).json({ success:false, message:'Email ou mot de passe incorrect.' });
    }

    if (!user.isActive)
      return res.status(403).json({ success:false, message:"Compte désactivé. Contactez l'administrateur." });

    console.log('✅ Connecté :', user.email, '|', user.role);
    return res.json({
      success: true,
      token:   genToken(user._id),
      user:    { id: user._id, nom: user.nom, email: user.email, role: user.role, telephone: user.telephone, adresse: user.adresse },
    });
  } catch (err) {
    console.error('❌ Connexion :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// ── GET /api/auth/moi ─────────────────────────────────────────────────────
router.get('/moi', protect, (req, res) => {
  res.json({ success:true, user: req.user });
});

// ── PUT /api/auth/profil ✅ NOUVEAU ────────────────────────────────────────
// Modifier nom, téléphone, adresse
router.put('/profil', protect, async (req, res) => {
  try {
    const { nom, telephone, adresse } = req.body;

    if (!nom?.trim())
      return res.status(400).json({ success:false, message:'Le nom est obligatoire.' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nom: nom.trim(), telephone: telephone || '', adresse: adresse || '' },
      { new: true, runValidators: true }
    );

    if (!user)
      return res.status(404).json({ success:false, message:'Utilisateur non trouvé.' });

    console.log('✅ Profil mis à jour :', user.email);
    return res.json({
      success: true,
      message: 'Profil mis à jour avec succès.',
      user:    { id: user._id, nom: user.nom, email: user.email, role: user.role, telephone: user.telephone, adresse: user.adresse },
    });
  } catch (err) {
    console.error('❌ Profil :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// ── PUT /api/auth/changer-mdp ✅ NOUVEAU ──────────────────────────────────
// Changer le mot de passe
router.put('/changer-mdp', protect, async (req, res) => {
  try {
    const { ancienMdp, nouveauMdp } = req.body;

    if (!ancienMdp || !nouveauMdp)
      return res.status(400).json({ success:false, message:'Ancien et nouveau mot de passe requis.' });

    if (nouveauMdp.length < 6)
      return res.status(400).json({ success:false, message:'Nouveau mot de passe : minimum 6 caractères.' });

    // Récupérer avec le mot de passe (select:false par défaut)
    const user = await User.findById(req.user._id).select('+motDePasse');
    if (!user)
      return res.status(404).json({ success:false, message:'Utilisateur non trouvé.' });

    // Vérifier l'ancien mot de passe
    const ok = await user.verifierMotDePasse(ancienMdp);
    if (!ok)
      return res.status(400).json({ success:false, message:'Mot de passe actuel incorrect.' });

    // Mettre à jour — le hook pre-save hashera automatiquement
    user.motDePasse = nouveauMdp;
    await user.save();

    console.log('✅ Mot de passe changé :', user.email);
    return res.json({ success:true, message:'Mot de passe modifié avec succès.' });

  } catch (err) {
    console.error('❌ Changer mdp :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// ── DELETE /api/auth/compte ✅ NOUVEAU ────────────────────────────────────
// Supprimer son propre compte
router.delete('/compte', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    console.log('🗑️ Compte supprimé :', req.user.email);
    return res.json({ success:true, message:'Compte supprimé avec succès.' });
  } catch (err) {
    console.error('❌ Supprimer compte :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

module.exports = router;