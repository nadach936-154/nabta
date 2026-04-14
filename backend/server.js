// backend/server.js — version complète avec toutes les routes
const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Log toutes les requêtes (debug) ─────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} | ${req.method} ${req.path}`);
  next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/produits',    require('./routes/produits'));
app.use('/api/livraisons',  require('./routes/livraisons'));
app.use('/api/rapports',    require('./routes/rapports'));
app.use('/api/ministere',   require('./routes/ministere')); // ← Ministère Agriculture

// ── Route de santé ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message:'🌱 NABTA API en ligne', status:'OK', version:'2.0' });
});
app.get('/api/test', (req, res) => {
  res.json({ message:'✅ API fonctionne', routes:['/api/auth','/api/users','/api/ministere'] });
});

// ── Gestion routes inconnues ─────────────────────────────────────────────────
app.use((req, res) => {
  console.log(`❌ Route inconnue: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.method} ${req.path}`,
    routesDisponibles: [
      'POST /api/auth/inscription',
      'POST /api/auth/connexion',
      'GET  /api/auth/moi',
      'GET  /api/ministere/verifier-cin/:cin',
      'GET  /api/ministere/agriculteurs',
    ],
  });
});

// ── Erreurs globales ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 NABTA API sur http://localhost:${PORT}`);
  console.log(`📋 Routes disponibles:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/inscription`);
  console.log(`   POST http://localhost:${PORT}/api/auth/connexion`);
  console.log(`   GET  http://localhost:${PORT}/api/ministere/verifier-cin/12345678`);
  console.log('');
});