// frontend/src/setupProxy.js
// Ce fichier est automatiquement détecté par Create React App
// Il redirige TOUTES les requêtes /api vers le backend port 5000

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target:       'http://localhost:5000',
      changeOrigin: true,
      secure:       false,
    })
  );
};