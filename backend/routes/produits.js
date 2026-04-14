const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const { protect, autoriser } = require('../middleware/auth');

// GET /api/produits — Liste tous les produits (public)
router.get('/', async (req, res) => {
  try {
    const { categorie, search } = req.query;
    let filtre = {};
    if (categorie) filtre.categorie = categorie;
    if (search)    filtre.nom = { $regex: search, $options: 'i' };

    const produits = await Produit.find(filtre).populate('fournisseur', 'nom email');
    res.json({ success: true, count: produits.length, produits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/produits/:id
router.get('/:id', async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id).populate('fournisseur', 'nom email telephone');
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    res.json({ success: true, produit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/produits — Créer un produit (fournisseur ou agriculteur)
router.post('/', protect, autoriser('fournisseur', 'agriculteur', 'admin'), async (req, res) => {
  try {
    const produit = await Produit.create({ ...req.body, fournisseur: req.user._id });
    res.status(201).json({ success: true, produit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/produits/:id — Modifier un produit
router.put('/:id', protect, autoriser('fournisseur', 'agriculteur', 'admin'), async (req, res) => {
  try {
    let produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable.' });

    // Seul le propriétaire ou admin peut modifier
    if (produit.fournisseur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Non autorisé.' });
    }

    produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, produit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/produits/:id
router.delete('/:id', protect, autoriser('fournisseur', 'agriculteur', 'admin'), async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable.' });

    if (produit.fournisseur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Non autorisé.' });
    }

    await produit.deleteOne();
    res.json({ success: true, message: 'Produit supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;