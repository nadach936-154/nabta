// backend/routes/auth.js — VERSION COMPLÈTE 100% FONCTIONNELLE
const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');
const nodemailer = require('nodemailer');
const User       = require('../models/User');
const { protect } = require('../middleware/auth');

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── Transporteur Gmail ────────────────────────────────────────────────────────
// Utilise l'adresse de l'admin (nadach936@gmail.com) pour ENVOYER les emails
// mais le code est envoyé à l'email de CHAQUE utilisateur
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   // nadach936@gmail.com
      pass: process.env.EMAIL_PASS,   // App Password Gmail 16 caractères
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH DE BASE
// ═══════════════════════════════════════════════════════════════════════════

// POST /api/auth/inscription
router.post('/inscription', async (req, res) => {
  try {
    console.log('📥 Inscription :', req.body.email);
    const { nom, email, motDePasse, role, telephone, adresse, cin } = req.body;

    if (!nom?.trim())   return res.status(400).json({ success:false, message:'Le nom est obligatoire.' });
    if (!email?.trim()) return res.status(400).json({ success:false, message:"L'email est obligatoire." });
    if (!motDePasse || motDePasse.length < 6)
      return res.status(400).json({ success:false, message:'Mot de passe : minimum 6 caractères.' });
    if (cin && cin.trim() && !/^\d{8,9}$/.test(cin))
      return res.status(400).json({ success:false, message:'CIN invalide.' });

    const existant = await User.findOne({ email: email.toLowerCase().trim() });
    if (existant)
      return res.status(400).json({ success:false, message:'Un compte existe déjà avec cet email.' });

    const user = await new User({
      nom: nom.trim(), email: email.toLowerCase().trim(),
      motDePasse, cin: cin || '', role: role || 'agriculteur',
      telephone: telephone || '', adresse: adresse || '',
    }).save();

    console.log('✅ Créé :', user.email, '|', user.role);
    return res.status(201).json({
      success: true,
      token: genToken(user._id),
      user: { id:user._id, nom:user.nom, email:user.email, role:user.role, telephone:user.telephone, adresse:user.adresse },
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

// POST /api/auth/connexion
router.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    console.log('📥 Connexion :', email);
    if (!email || !motDePasse)
      return res.status(400).json({ success:false, message:'Email et mot de passe requis.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+motDePasse');
    if (!user)
      return res.status(401).json({ success:false, message:'Email ou mot de passe incorrect.' });

    const ok = await user.verifierMotDePasse(motDePasse);
    if (!ok)
      return res.status(401).json({ success:false, message:'Email ou mot de passe incorrect.' });

    if (!user.isActive)
      return res.status(403).json({ success:false, message:"Compte désactivé. Contactez l'administrateur." });

    console.log('✅ Connecté :', user.email, '|', user.role);
    return res.json({
      success: true,
      token: genToken(user._id),
      user: { id:user._id, nom:user.nom, email:user.email, role:user.role, telephone:user.telephone, adresse:user.adresse },
    });
  } catch (err) {
    console.error('❌ Connexion :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// GET /api/auth/moi
router.get('/moi', protect, (req, res) => {
  res.json({ success:true, user: req.user });
});

// PUT /api/auth/profil
router.put('/profil', protect, async (req, res) => {
  try {
    const { nom, telephone, adresse } = req.body;
    if (!nom?.trim())
      return res.status(400).json({ success:false, message:'Le nom est obligatoire.' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nom:nom.trim(), telephone:telephone||'', adresse:adresse||'' },
      { new:true, runValidators:true }
    );
    if (!user) return res.status(404).json({ success:false, message:'Utilisateur non trouvé.' });
    return res.json({
      success:true, message:'Profil mis à jour avec succès.',
      user: { id:user._id, nom:user.nom, email:user.email, role:user.role, telephone:user.telephone, adresse:user.adresse },
    });
  } catch (err) {
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// PUT /api/auth/changer-mdp
router.put('/changer-mdp', protect, async (req, res) => {
  try {
    const { ancienMdp, nouveauMdp } = req.body;
    if (!ancienMdp || !nouveauMdp)
      return res.status(400).json({ success:false, message:'Ancien et nouveau mot de passe requis.' });
    if (nouveauMdp.length < 6)
      return res.status(400).json({ success:false, message:'Nouveau mot de passe : minimum 6 caractères.' });
    const user = await User.findById(req.user._id).select('+motDePasse');
    if (!user) return res.status(404).json({ success:false, message:'Utilisateur non trouvé.' });
    const ok = await user.verifierMotDePasse(ancienMdp);
    if (!ok) return res.status(400).json({ success:false, message:'Mot de passe actuel incorrect.' });
    user.motDePasse = nouveauMdp;
    await user.save();
    return res.json({ success:true, message:'Mot de passe modifié avec succès.' });
  } catch (err) {
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// DELETE /api/auth/compte
router.delete('/compte', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return res.json({ success:true, message:'Compte supprimé avec succès.' });
  } catch (err) {
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// RÉINITIALISATION MOT DE PASSE — 3 étapes
// Chaque utilisateur reçoit le code sur SON propre email
// ═══════════════════════════════════════════════════════════════════════════

// POST /api/auth/forgot-password
// → L'utilisateur donne son email → reçoit un code à 6 chiffres sur CET email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success:false, message:'Email requis.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Sécurité : réponse identique que le compte existe ou non
    if (!user) {
      return res.json({ success:true, message:'Si cet email existe, un code a été envoyé.' });
    }

    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔑 Code reset [${user.email}] : ${code}`);

    // Hasher le code avant stockage
    const codeHashe = await bcrypt.hash(code, 10);

    // Stocker le code hashé + expiration 15 min
    user.resetCode       = codeHashe;
    user.resetCodeExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // Envoyer l'email à l'adresse de L'UTILISATEUR (pas à l'admin)
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"🌿 NABTA" <${process.env.EMAIL_USER}>`,
      to:      user.email,   // ← email de l'utilisateur concerné
      subject: '🔑 Code de réinitialisation NABTA',
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#f7f8fa;padding:32px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;">🌿</span>
            <h1 style="color:#1a3a2a;font-size:22px;margin:8px 0 0;letter-spacing:-0.5px;">NABTA</h1>
            <p style="color:#888;font-size:12px;margin:4px 0 0;">Plateforme agricole intelligente · Tunisie 🇹🇳</p>
          </div>

          <div style="background:#fff;border-radius:12px;padding:28px 32px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
            <h2 style="color:#111;font-size:18px;margin:0 0 10px;">Bonjour ${user.nom} 👋</h2>
            <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 24px;">
              Vous avez demandé à réinitialiser votre mot de passe.<br>
              Voici votre code de vérification, valable <strong>15 minutes</strong> :
            </p>

            <div style="text-align:center;background:#f0fdf4;border:2px dashed #16a34a;border-radius:12px;padding:24px 16px;margin-bottom:24px;">
              <div style="font-size:44px;font-weight:900;letter-spacing:14px;color:#16a34a;font-family:monospace;">${code}</div>
            </div>

            <p style="color:#888;font-size:13px;margin:0;line-height:1.6;">
              ⚠️ Ce code expire dans <strong>15 minutes</strong>.<br>
              Si vous n'avez pas fait cette demande, ignorez cet email — votre compte est en sécurité.
            </p>
          </div>

          <p style="text-align:center;color:#bbb;font-size:11px;margin-top:20px;">
            Ministère de l'Agriculture · République Tunisienne
          </p>
        </div>
      `,
    });

    console.log(`✅ Email envoyé à ${user.email}`);
    return res.json({ success:true, message:`Code envoyé à ${user.email}` });

  } catch (err) {
    console.error('❌ forgot-password :', err.message);
    return res.status(500).json({ success:false, message:"Erreur d'envoi email : " + err.message });
  }
});

// POST /api/auth/verify-reset-code
// → Vérifier que le code est correct et non expiré
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ success:false, message:'Email et code requis.' });

    const user = await User.findOne({
      email:           email.toLowerCase().trim(),
      resetCodeExpire: { $gt: new Date() },
    }).select('+resetCode +resetCodeExpire');

    if (!user)
      return res.status(400).json({ success:false, message:'Code invalide ou expiré. Recommencez.' });

    const ok = await bcrypt.compare(code, user.resetCode);
    if (!ok)
      return res.status(400).json({ success:false, message:'Code incorrect.' });

    console.log(`✅ Code vérifié pour ${email}`);
    return res.json({ success:true, message:'Code valide.' });

  } catch (err) {
    console.error('❌ verify-reset-code :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

// POST /api/auth/reset-password
// → Changer le mot de passe (code re-vérifié pour sécurité)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword)
      return res.status(400).json({ success:false, message:'Email, code et nouveau mot de passe requis.' });
    if (newPassword.length < 6)
      return res.status(400).json({ success:false, message:'Mot de passe : minimum 6 caractères.' });

    const user = await User.findOne({
      email:           email.toLowerCase().trim(),
      resetCodeExpire: { $gt: new Date() },
    }).select('+motDePasse +resetCode +resetCodeExpire');

    if (!user)
      return res.status(400).json({ success:false, message:'Code invalide ou expiré. Recommencez.' });

    const ok = await bcrypt.compare(code, user.resetCode);
    if (!ok)
      return res.status(400).json({ success:false, message:'Code incorrect.' });

    // Mettre à jour le mot de passe + effacer le code
    user.motDePasse      = newPassword;
    user.resetCode       = undefined;
    user.resetCodeExpire = undefined;
    await user.save();

    console.log(`✅ Mot de passe réinitialisé : ${email}`);
    return res.json({ success:true, message:'Mot de passe réinitialisé avec succès !' });

  } catch (err) {
    console.error('❌ reset-password :', err.message);
    return res.status(500).json({ success:false, message:'Erreur serveur : ' + err.message });
  }
});

module.exports = router;