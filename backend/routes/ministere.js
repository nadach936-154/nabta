// backend/routes/ministere.js
// Simulation de la base de données du Ministère de l'Agriculture de Tunisie
// En production : remplacer par l'appel à la vraie API du Ministère

const express = require('express');
const router  = express.Router();

// ══════════════════════════════════════════════════════════════════════════════
// BASE DE DONNÉES SIMULÉE — Ministère de l'Agriculture Tunisie
// Contient les agriculteurs officiellement enregistrés avec leur CIN
// ══════════════════════════════════════════════════════════════════════════════
const DB_MINISTERE = [
  // Format: { cin, nom, region, gouvernorat, typeExploitation, surfaceTotale, dateEnregistrement }
  { cin:'12345678', nom:'Ahmed Bennani',      region:'Nord',    gouvernorat:'Ariana',   typeExploitation:'Céréales',      surfaceTotale:'12 ha', dateEnregistrement:'2018-03-15' },
  { cin:'23456789', nom:'Mohamed Trabelsi',   region:'Centre',  gouvernorat:'Kairouan', typeExploitation:'Maraîchage',    surfaceTotale:'8 ha',  dateEnregistrement:'2019-07-22' },
  { cin:'34567890', nom:'Hassan El Fassi',    region:'Nord',    gouvernorat:'Béja',     typeExploitation:'Céréales',      surfaceTotale:'25 ha', dateEnregistrement:'2017-01-10' },
  { cin:'45678901', nom:'Fatma Gharbi',       region:'Sud',     gouvernorat:'Médenine', typeExploitation:'Palmier dattier',surfaceTotale:'5 ha', dateEnregistrement:'2020-05-30' },
  { cin:'56789012', nom:'Karim Hamdi',        region:'Centre',  gouvernorat:'Sfax',     typeExploitation:'Arboriculture', surfaceTotale:'15 ha', dateEnregistrement:'2016-11-08' },
  { cin:'67890123', nom:'Leila Mansour',      region:'Nord',    gouvernorat:'Bizerte',  typeExploitation:'Maraîchage',    surfaceTotale:'6 ha',  dateEnregistrement:'2021-02-14' },
  { cin:'78901234', nom:'Omar Ben Salah',     region:'Centre',  gouvernorat:'Sousse',   typeExploitation:'Oliviers',      surfaceTotale:'20 ha', dateEnregistrement:'2015-09-03' },
  { cin:'89012345', nom:'Amina Zouari',       region:'Nord',    gouvernorat:'Nabeul',   typeExploitation:'Maraîchage',    surfaceTotale:'4 ha',  dateEnregistrement:'2022-06-18' },
  { cin:'90123456', nom:'Ridha Chaabane',     region:'Sud',     gouvernorat:'Gafsa',    typeExploitation:'Céréales',      surfaceTotale:'30 ha', dateEnregistrement:'2014-12-01' },
  { cin:'11223344', nom:'Nadia Jemni',        region:'Centre',  gouvernorat:'Mahdia',   typeExploitation:'Maraîchage',    surfaceTotale:'7 ha',  dateEnregistrement:'2020-03-25' },
  { cin:'22334455', nom:'Tarek Boughanmi',    region:'Nord',    gouvernorat:'Jendouba', typeExploitation:'Céréales',      surfaceTotale:'18 ha', dateEnregistrement:'2018-08-12' },
  { cin:'33445566', nom:'Sonia Khemiri',      region:'Centre',  gouvernorat:'Monastir', typeExploitation:'Oliviers',      surfaceTotale:'10 ha', dateEnregistrement:'2019-04-07' },
  { cin:'44556677', nom:'Ali Sfaxi',          region:'Sud',     gouvernorat:'Gabès',    typeExploitation:'Maraîchage',    surfaceTotale:'9 ha',  dateEnregistrement:'2021-11-30' },
  { cin:'55667788', nom:'Mounira Dakhli',     region:'Nord',    gouvernorat:'Le Kef',   typeExploitation:'Élevage bovin', surfaceTotale:'40 ha', dateEnregistrement:'2016-06-15' },
  { cin:'66778899', nom:'Hedi Nouira',        region:'Centre',  gouvernorat:'Siliana',  typeExploitation:'Arboriculture', surfaceTotale:'12 ha', dateEnregistrement:'2017-10-20' },
  { cin:'77889900', nom:'Ikram Belhaj',       region:'Sud',     gouvernorat:'Kébili',   typeExploitation:'Palmier dattier',surfaceTotale:'8 ha', dateEnregistrement:'2023-01-05' },
  { cin:'88990011', nom:'Nada CH',            region:'Nord',    gouvernorat:'Tunis',    typeExploitation:'Administrateur',surfaceTotale:'—',    dateEnregistrement:'2024-01-01' },
  { cin:'99001122', nom:'Mokhtar Ben Amor',   region:'Centre',  gouvernorat:'Kasserine',typeExploitation:'Céréales',      surfaceTotale:'22 ha', dateEnregistrement:'2018-05-28' },
  { cin:'10203040', nom:'Wissal Chatti',      region:'Nord',    gouvernorat:'Zaghouan', typeExploitation:'Maraîchage',    surfaceTotale:'5 ha',  dateEnregistrement:'2022-09-14' },
  { cin:'20304050', nom:'Bilel Mahjoub',      region:'Centre',  gouvernorat:'Sidi Bouzid',typeExploitation:'Céréales',   surfaceTotale:'16 ha', dateEnregistrement:'2019-12-03' },
];

// ── GET /api/ministere/verifier-cin/:cin ─────────────────────────────────────
// Vérifier si un CIN est enregistré au Ministère
router.get('/verifier-cin/:cin', (req, res) => {
  const { cin } = req.params;

  // Validation format
  if (!/^\d{8}$/.test(cin)) {
    return res.status(400).json({
      success: false,
      valide:  false,
      message: 'Format CIN invalide. Le CIN doit contenir exactement 8 chiffres.',
    });
  }

  const agriculteur = DB_MINISTERE.find(a => a.cin === cin);

  if (!agriculteur) {
    return res.status(404).json({
      success: false,
      valide:  false,
      message: 'Ce CIN n\'est pas enregistré au Ministère de l\'Agriculture. Veuillez contacter votre délégation agricole régionale.',
    });
  }

  // Masquer une partie du nom pour la confidentialité
  const nomParts  = agriculteur.nom.split(' ');
  const nomMasque = nomParts.map((p, i) => i === 0 ? p : p[0] + '***').join(' ');

  return res.json({
    success: true,
    valide:  true,
    message: 'CIN validé par le Ministère de l\'Agriculture',
    agriculteur: {
      cinMasque:          cin.slice(0,3) + '*****',
      nom:                nomMasque,
      region:             agriculteur.region,
      gouvernorat:        agriculteur.gouvernorat,
      typeExploitation:   agriculteur.typeExploitation,
      surfaceTotale:      agriculteur.surfaceTotale,
      dateEnregistrement: agriculteur.dateEnregistrement,
    },
  });
});

// ── GET /api/ministere/agriculteurs ─────────────────────────────────────────
// Liste des agriculteurs (admin seulement — données masquées)
router.get('/agriculteurs', (req, res) => {
  const liste = DB_MINISTERE.map(a => ({
    cin:              a.cin.slice(0,3) + '*****',
    gouvernorat:      a.gouvernorat,
    region:           a.region,
    typeExploitation: a.typeExploitation,
    surfaceTotale:    a.surfaceTotale,
  }));
  res.json({ success: true, count: liste.length, agriculteurs: liste });
});

// ── GET /api/ministere/stats ─────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  const stats = {
    total: DB_MINISTERE.length,
    parRegion: {
      Nord:   DB_MINISTERE.filter(a => a.region === 'Nord').length,
      Centre: DB_MINISTERE.filter(a => a.region === 'Centre').length,
      Sud:    DB_MINISTERE.filter(a => a.region === 'Sud').length,
    },
    parTypeExploitation: {},
  };
  DB_MINISTERE.forEach(a => {
    stats.parTypeExploitation[a.typeExploitation] = (stats.parTypeExploitation[a.typeExploitation] || 0) + 1;
  });
  res.json({ success: true, stats });
});

module.exports = router;