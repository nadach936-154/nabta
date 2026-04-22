// backend/routes/users.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect, autoriser } = require('../middleware/auth');

// GET /api/users — Admin : liste tous les utilisateurs
router.get('/', protect, autoriser('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse').sort({ dateCreation: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id/toggle-actif — Admin : activer / désactiver un compte
router.put('/:id/toggle-actif', protect, autoriser('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id/activer — Admin : activer/désactiver (compatibilité ancienne route)
router.put('/:id/activer', protect, autoriser('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;