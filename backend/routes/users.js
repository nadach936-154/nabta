const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, autoriser } = require('../middleware/auth');

// GET /api/users — Admin seulement
router.get('/', protect, autoriser('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/users/annuaire — Annuaire des professionnels (public)
router.get('/annuaire', async (req, res) => {
  try {
    const { role } = req.query;
    let filtre = { role: { $in: ['veterinaire', 'fournisseur', 'transporteur'] } };
    if (role) filtre.role = role;

    const professionnels = await User.find(filtre).select('nom email telephone adresse role');
    res.json({ success: true, professionnels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/profil — Modifier son profil
router.put('/profil', protect, async (req, res) => {
  try {
    const { nom, telephone, adresse } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nom, telephone, adresse },
      { new: true, runValidators: true }
    ).select('-motDePasse');
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/users/:id/activer — Admin : activer/désactiver compte
router.put('/:id/activer', protect, autoriser('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
// PUT /api/users/changer-mdp
router.put('/changer-mdp', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+motDePasse');
    const ok   = await user.verifierMotDePasse(req.body.ancienMdp);
    if (!ok) return res.status(401).json({ success: false, message: 'Ancien mot de passe incorrect.' });
    user.motDePasse = req.body.nouveauMdp;
    await user.save();
    res.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;