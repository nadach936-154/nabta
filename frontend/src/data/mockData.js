// src/data/mockData.js
// ✅ TOUS les emails en MINUSCULES (correspondance parfaite avec le backend)

export const LISTE_CIN_MINISTERE = {
  '14049070': { gouvernorat:'Tunis',    type:'Céréales',        surface:'15 ha', region:'Nord'   },
  '10085090': { gouvernorat:'Sfax',     type:'Oliviers',        surface:'22 ha', region:'Centre' },
  '12080971': { gouvernorat:'Nabeul',   type:'Maraîchage',      surface:'8 ha',  region:'Nord'   },
  '15226371': { gouvernorat:'Béja',     type:'Céréales',        surface:'30 ha', region:'Nord'   },
  '12345678': { gouvernorat:'Ariana',   type:'Maraîchage',      surface:'12 ha', region:'Nord'   },
  '12457896': { gouvernorat:'Sousse',   type:'Arboriculture',   surface:'18 ha', region:'Centre' },
  '32659874': { gouvernorat:'Kairouan', type:'Céréales',        surface:'25 ha', region:'Centre' },
  '25361478': { gouvernorat:'Bizerte',  type:'Élevage',         surface:'40 ha', region:'Nord'   },
  '74196325': { gouvernorat:'Gafsa',    type:'Palmier dattier', surface:'10 ha', region:'Sud'    },
  '14049071': { gouvernorat:'Tunis',    type:'Administrateur',  surface:'—',     region:'Nord'   },
  '45678901': { gouvernorat:'Sfax',     type:'Transport',       surface:'—',     region:'Centre' },
  '99999999': { gouvernorat:'Tunis',    type:'Administrateur',  surface:'—',     region:'Nord'   },
};

// ✅ TOUS les emails en minuscules obligatoirement
export const MOCK_USERS = [
  {
    id:11, nom:'Sarah Majjedi',
    email:'sarahagri@nabta.tn',           // ✅ minuscules
    motDePasse:'sarra936154',
    role:'agriculteur',
    telephone:'+216 29 544 745', adresse:'Tunis, Ariana', actif:true, cin:'15226371',
  },
  {
    id:12, nom:'Loujayen Lahmidi',
    email:'loujayenfourni@nabta.tn',       // ✅ minuscules
    motDePasse:'loujayen936154',
    role:'fournisseur',
    telephone:'+216 21 869 285', adresse:'Sousse', actif:true, cin:'12080971',
  },
  {
    id:13, nom:'Dr. Chourouk Weslati',
    email:'chouroukveteri@nabta.tn',       // ✅ CORRIGÉ — était Chouroukveteri (majuscule)
    motDePasse:'Chourouk123456',
    role:'veterinaire',
    telephone:'+216 22 955 496', adresse:'Nabeul', actif:true, cin:'10085090',
  },
  {
    id:14, nom:'Amani Aslouje',
    email:'amanitrans@nabta.tn',           // ✅ CORRIGÉ — était Amanitrans (majuscule)
    motDePasse:'Amani154936',
    role:'transporteur',
    telephone:'+216 54 571 037', adresse:'Sfax', actif:true, cin:'45678901',
  },
  {
    id:15, nom:'Admin NABTA',
    email:'admin@nabta.tn',
    motDePasse:'admin',
    role:'admin',
    telephone:'+216 70 000 001', adresse:'Tunis', actif:true, cin:'99999999',
  },
  {
    id:10, nom:'Nada CH',
    email:'nadach936@gmail.com',
    motDePasse:'936nada154',
    role:'admin',
    telephone:'+216 52 226 330', adresse:'Tunisie', actif:true, cin:'14049071',
  },
];

export const MOCK_CULTURES = [
  { id:1, nom:'Blé Dur',         surface:'12 ha', statut:'croissance', recolte:'Avr 2026', parcelle:'P-001', sante:85 },
  { id:2, nom:'Tomates',         surface:'5 ha',  statut:'floraison',  recolte:'Mar 2026', parcelle:'P-002', sante:92 },
  { id:3, nom:'Oliviers',        surface:'20 ha', statut:'repos',      recolte:'Oct 2026', parcelle:'P-003', sante:78 },
  { id:4, nom:'Pommes de Terre', surface:'8 ha',  statut:'plantation', recolte:'Mai 2026', parcelle:'P-004', sante:90 },
];

export const MOCK_RAPPORTS_VET = [
  { id:'#R001', animal:'Vache laitière',   ferme:'—', diag:'Fièvre aphteuse',      trt:'Antipyrétiques',     statut:'urgence',    date:'2026-04-01' },
  { id:'#R002', animal:'Troupeau moutons', ferme:'—', diag:'Contrôle vaccinal',    trt:'Vaccin clostridium', statut:'normal',     date:'2026-03-30' },
  { id:'#R003', animal:'Poulets de chair', ferme:'—', diag:'Bronchite infectieuse',trt:'Antibiotiques',      statut:'suivi',      date:'2026-03-29' },
];

export const MOCK_ACTIVITES = [
  { action:'Irrigation effectuée',        culture:'Blé Dur', heure:'08:30', icon:'💧' },
  { action:'Traitement phytosanitaire',   culture:'Tomates', heure:'10:15', icon:'🌿' },
  { action:'Alerte météo — Pluie prévue',culture:'Général', heure:'15:30', icon:'🌧' },
];

export const MOCK_LIVRAISONS            = [];
export const MOCK_DEMANDES_TRANSPORT    = [];
export const MOCK_HISTORIQUE_TRANSPORT  = [];
export const MOCK_COMMANDES             = [];
export const MOCK_CONSULTATIONS         = [];


export const MOCK_PRODUITS = [
  {
    id: 1,
    nom: 'Engrais Bio Premium',
    categorie: 'Engrais',
    prix: 450,
    unite: 'sac',
    stock: 150,
    fournisseur: 'Loujayen Lahmidi',
    statut: 'disponible',
    description: 'Engrais naturel haute qualité',
  },
  {
    id: 2,
    nom: 'Semences de Blé',
    categorie: 'Semences',
    prix: 320,
    unite: 'kg',
    stock: 45,
    fournisseur: 'Loujayen Lahmidi',
    statut: 'stock_bas',
    description: 'Semences certifiées blé dur',
  },
  {
    id: 3,
    nom: 'Pesticide Naturel',
    categorie: 'Protection',
    prix: 280,
    unite: 'litre',
    stock: 0,
    fournisseur: 'Loujayen Lahmidi',
    statut: 'rupture',
    description: 'Protection bio contre les insectes',
  },
  {
    id: 4,
    nom: "Système d'Irrigation",
    categorie: 'Équipement',
    prix: 1200,
    unite: 'unité',
    stock: 85,
    fournisseur: 'Loujayen Lahmidi',
    statut: 'disponible',
    description: 'Irrigation goutte-à-goutte',
  },
];