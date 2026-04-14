// frontend/src/pages/fournisseur/MesProduits.jsx
// Identique à Produits.jsx MAIS filtré uniquement sur les produits du fournisseur connecté
// Modifier chargerProduits() pour utiliser :
// GET /api/produits?fournisseur=moi (ajouter ce filtre dans la route backend)

// backend/routes/produits.js — ajouter dans le GET /
if (req.query.fournisseur === 'moi' && req.user) {
  filtre.fournisseur = req.user._id;
}

// frontend — MesProduits.jsx
import Produits from '../Produits';

export default function MesProduits() {
  // Réutilise la page Produits avec filtre "mes produits"
  return <Produits mesProduits={true} />;
}

// Dans Produits.jsx, accepter la prop mesProduits :
export default function Produits({ mesProduits = false }) {
  // ...
  const chargerProduits = async () => {
    const params = {};
    if (search)      params.search    = search;
    if (categorie)   params.categorie = categorie;
    if (mesProduits) params.fournisseur = 'moi';
    const { data } = await axios.get('/api/produits', { params });
    // ...
  };
}