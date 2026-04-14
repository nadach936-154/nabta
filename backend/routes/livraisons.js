const express = require('express');
const router = express.Router();
const Livraison = require('../models/Livraison');
const { protect, autoriser } = require('../middleware/auth');

// GET /api/livraisons — Livraisons selon le rôle
router.get('/', protect, async (req, res) => {
  try {
    let filtre = {};
    if (req.user.role === 'agriculteur') filtre.acheteur = req.user._id;
    if (req.user.role === 'transporteur') filtre.transporteur = req.user._id;

    const livraisons = await Livraison.find(filtre)
      .populate('produit', 'nom prix')
      .populate('acheteur', 'nom email')
      .populate('transporteur', 'nom telephone');
    res.json({ success: true, livraisons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/livraisons
router.post('/', protect, async (req, res) => {
  try {
    const livraison = await Livraison.create({ ...req.body, acheteur: req.user._id });
    res.status(201).json({ success: true, livraison });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/livraisons/:id/statut — Mettre à jour le statut
router.put('/:id/statut', protect, autoriser('transporteur', 'admin'), async (req, res) => {
  try {
    const livraison = await Livraison.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      { new: true }
    );
    if (!livraison) return res.status(404).json({ success: false, message: 'Livraison introuvable.' });
    res.json({ success: true, livraison });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;