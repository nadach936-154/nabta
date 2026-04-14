const express = require('express');
const router = express.Router();
const Rapport = require('../models/RapportVeterinaire');
const { protect, autoriser } = require('../middleware/auth');

// GET /api/rapports
router.get('/', protect, async (req, res) => {
  try {
    let filtre = {};
    if (req.user.role === 'veterinaire') filtre.veterinaire = req.user._id;

    const rapports = await Rapport.find(filtre)
      .populate('veterinaire', 'nom email')
      .populate('agriculteur', 'nom');
    res.json({ success: true, rapports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/rapports
router.post('/', protect, autoriser('veterinaire', 'admin'), async (req, res) => {
  try {
    const rapport = await Rapport.create({ ...req.body, veterinaire: req.user._id });
    res.status(201).json({ success: true, rapport });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/rapports/:id
router.delete('/:id', protect, autoriser('veterinaire', 'admin'), async (req, res) => {
  try {
    await Rapport.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Rapport supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;