const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Vérifier le token JWT
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Utilisateur introuvable.' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide.' });
  }
};

// Restreindre l'accès par rôle
exports.autoriser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle '${req.user.role}' non autorisé.`
      });
    }
    next();
  };
};