// src/data/mockData.js

// ── Liste CIN validés par le Ministère de l'Agriculture ───────────────────
// En production : cette vérification se fait côté backend via une API sécurisée
export const LISTE_CIN_MINISTERE = [
  '12345678', '23456789', '34567890',  '56789012',
  '67890123', '78901234', '89012345', '90123456', '11223344',
  '22334455', '33445566', '44556677', '55667788', '66778899',
  '77889900', '88990011', '99001122', '10203040', '20304050',
  '45678901',
  '14049071',
  '10085090',
  '12080971',
  '15226371',
];

export const MOCK_USERS = [
  { id:11, nom:'Sarah Majjedi',    email:'sarahagri@nabta.tn', motDePasse:'sarra936154', role:'agriculteur',  telephone:'+21629544745', adresse:'Tunis, Ariana', actif:true, cin:'15226371' },
  { id:12, nom:'Loujayen lahmidi',     email:'loujayenfourni@nabta.tn', motDePasse:'loujayen936154', role:'fournisseur',  telephone:'+216 21 869 285', adresse:'Sousse',  actif:true, cin:'12080971' },
  { id:13, nom:'Dr.Chourouk Weslati',email:'Chouroukveteri@nabta.tn', motDePasse:'Chourouk123456', role:'veterinaire',  telephone:'+216 22 955 496', adresse:'Nabeul',        actif:true, cin:'10085090' },
  { id:14, nom:'Amani Aslouje',      email:'Amanitrans@nabta.tn',motDePasse:'Amani154936', role:'transporteur', telephone:'+216 54 571 037', adresse:'Sfax',          actif:true, cin:'45678901' },
  { id:15, nom:'Admin NABTA2',      email:'admin@nabta.tn',       motDePasse:'admin',  role:'admin',        telephone:'+216 70 000 001', adresse:'Tunis',         actif:true, cin:'99999999' },
  { id:10, nom:'Nada CH',          email:'nadach936@gmail.com',  motDePasse:'936nada154', role:'admin',    telephone:'+216 52 226 330', adresse:'Tunisie',       actif:true, cin:'14049071' },
];

export const MOCK_CULTURES = [
  { id:1, nom:'Blé Dur',         surface:'12 ha', statut:'croissance', recolte:'Avr 2026', parcelle:'P-001', sante:85 },
  { id:2, nom:'Tomates',         surface:'5 ha',  statut:'floraison',  recolte:'Mar 2026', parcelle:'P-002', sante:92 },
  { id:3, nom:'Oliviers',        surface:'20 ha', statut:'repos',      recolte:'Oct 2026', parcelle:'P-003', sante:78 },
  { id:4, nom:'Pommes de Terre', surface:'8 ha',  statut:'plantation', recolte:'Mai 2026', parcelle:'P-004', sante:90 },
  { id:5, nom:'Piments',         surface:'3 ha',  statut:'recolte',    recolte:'Mar 2026', parcelle:'P-005', sante:95 },
];

export const MOCK_PRODUITS = [
  { id:1, nom:'Engrais Bio Premium',   cat:'Engrais',    prix:450,  qte:150, statut:'stock',   fournisseur:'Fatima Zahra',  vendeur:'fournisseur' },
  { id:2, nom:'Semences de Blé',        cat:'Semences',   prix:320,  qte:45,  statut:'bas',     fournisseur:'Fatima Zahra',  vendeur:'fournisseur' },
  { id:3, nom:'Pesticide Naturel',      cat:'Protection', prix:280,  qte:0,   statut:'rupture', fournisseur:'Sara Belhadj',  vendeur:'fournisseur' },
  { id:4, nom:"Système d'Irrigation",  cat:'Équipement', prix:1200, qte:85,  statut:'stock',   fournisseur:'Fatima Zahra',  vendeur:'fournisseur' },
  { id:5, nom:'Fertilisant Organique',  cat:'Engrais',    prix:380,  qte:120, statut:'stock',   fournisseur:'Sara Belhadj',  vendeur:'fournisseur' },
  { id:6, nom:'Maïs Grain — Récolte 2026', cat:'Culture', prix:12,  qte:500, statut:'stock',   fournisseur:'Ahmed Bennani', vendeur:'agriculteur' },
  { id:7, nom:'Huile d\'olive extra',   cat:'Culture',    prix:18,   qte:200, statut:'stock',   fournisseur:'Ahmed Bennani', vendeur:'agriculteur' },
];

export const MOCK_COMMANDES = [
  { id:'#C001', produit:'Engrais Bio Premium',   client:'Ahmed Bennani',   qte:10, total:4500, date:'2026-02-28', statut:'attente' },
  { id:'#C002', produit:"Système d'Irrigation",  client:'Mohammed Tazi',   qte:2,  total:2400, date:'2026-02-27', statut:'traitement' },
  { id:'#C003', produit:'Semences de Blé',         client:'Hassan El Fassi',qte:25, total:8000, date:'2026-02-26', statut:'expediee' },
  { id:'#C004', produit:'Fertilisant Organique',   client:'Karim Idrissi',  qte:15, total:5700, date:'2026-02-25', statut:'livree' },
];

export const MOCK_LIVRAISONS = [
  { id:'#L001', produit:'Engrais Bio Premium',   from:'Tunis',   to:'Nabeul',   client:'Ahmed Bennani',  statut:'en_cours',   total:4500, date:'2026-04-02', distance:'85 km'  },
  { id:'#L002', produit:'Semences de Blé',         from:'Sfax',    to:'Gafsa',    client:'Sara Mansour',   statut:'en_attente', total:2100, date:'2026-04-02', distance:'130 km' },
  { id:'#L003', produit:"Système d'Irrigation",   from:'Bizerte', to:'Béja',     client:'Ferme El Kef',   statut:'livre',      total:6200, date:'2026-04-01', distance:'60 km'  },
  { id:'#L004', produit:'Fertilisant Organique',   from:'Sousse',  to:'Kairouan', client:'Karim Idrissi',  statut:'en_cours',   total:1800, date:'2026-04-01', distance:'55 km'  },
];

export const MOCK_DEMANDES_TRANSPORT = [
  { id:'#D001', produit:'Engrais Bio 500kg',  from:'Tunis',  to:'Bizerte', distance:'65 km',  prix:180, date:'2026-04-05', client:'Ahmed Bennani',  telephone:'+216 71 234 567' },
  { id:'#D002', produit:'Semences Blé 200kg', from:'Sfax',   to:'Gafsa',   distance:'130 km', prix:220, date:'2026-04-06', client:'Sara Mansour',   telephone:'+216 73 111 222' },
  { id:'#D003', produit:'Matériel Agricole',  from:'Sousse', to:'Nabeul',  distance:'55 km',  prix:150, date:'2026-04-07', client:'Hamid Trabelsi', telephone:'+216 98 333 444' },
];

export const MOCK_HISTORIQUE_TRANSPORT = [
  { id:'#L003', produit:"Système d'Irrigation", from:'Bizerte', to:'Béja',     client:'Ferme El Kef',   total:6200, date:'2026-04-01', note:4.8 },
];

export const MOCK_RAPPORTS_VET = [
  { id:'#R001', animal:'Vache laitière',   ferme:'Ferme El Baraka', diag:'Fièvre aphteuse',      trt:'Antipyrétiques',     statut:'urgence',    date:'2026-04-01' },
  { id:'#R002', animal:'Troupeau moutons', ferme:'Ahmed Bennani',   diag:'Contrôle vaccinal',    trt:'Vaccin clostridium', statut:'normal',     date:'2026-03-30' },
  { id:'#R003', animal:'Poulets de chair', ferme:'Ferme Nabeul',    diag:'Bronchite infectieuse',trt:'Antibiotiques',      statut:'suivi',      date:'2026-03-29' },
  { id:'#R004', animal:'Chèvres (12)',     ferme:'Sidi Bouzid',     diag:'Parasitose interne',   trt:'Vermifuge oral',     statut:'traitement', date:'2026-03-28' },
];

export const MOCK_CONSULTATIONS = [
  { id:'#V001', agriculteur:'Ahmed Bennani',   animal:'Vache laitière', urgence:true,  date:'2026-04-02 09:00', statut:'confirmee',  desc:'Fièvre élevée depuis 2 jours' },
  { id:'#V002', agriculteur:'Hassan El Fassi', animal:'Troupeau (20)',  urgence:false, date:'2026-04-03 14:00', statut:'en_attente', desc:'Contrôle vaccinal annuel'      },
  { id:'#V003', agriculteur:'Ferme Nabeul',    animal:'Poulets',        urgence:false, date:'2026-04-04 10:00', statut:'en_attente', desc:'Perte de poids anormale'       },
];

export const MOCK_ACTIVITES = [
  { action:'Irrigation effectuée',         culture:'Blé Dur',  heure:'08:30', icon:'💧' },
  { action:'Traitement phytosanitaire',    culture:'Tomates',  heure:'10:15', icon:'🌿' },
  { action:'Récolte partielle complétée',  culture:'Piments',  heure:'13:00', icon:'🌶' },
  { action:'Alerte météo — Pluie prévue', culture:'Général',  heure:'15:30', icon:'🌧' },
  { action:'Nouveau produit commandé',     culture:'Engrais',  heure:'16:00', icon:'📦' },
];

// Réponses IA intelligentes (fallback si pas d'API)
export const REPONSES_IA = [
  { mots:['irrig','eau','arros'],      rep:"💧 **Irrigation optimale** : Arrosez tôt le matin (6h-8h) ou en soirée (18h-20h). Blé : 400-600mm/saison. Tomates : 500-700mm. Le goutte-à-goutte économise 40% d'eau par rapport à l'aspersion. Vérifiez l'humidité du sol à 10cm de profondeur avant d'irriguer." },
  { mots:['malad','champign','rouill','mildi','oïdi'], rep:"🌿 **Maladies fréquentes en Tunisie** :\n• Rouille du blé (pustules orange) → Fongicide triazole\n• Mildiou tomate (taches huileuses) → Cuivre + Mancozèbe\n• Oïdium (poudre blanche) → Soufre en poudre\nAction : Isolez les plantes atteintes, traitez tôt le matin par temps sec." },
  { mots:['engrais','fertilis','npk','azote','phosph'], rep:"🌱 **Fertilisation équilibrée** :\n• N (Azote) → croissance foliaire\n• P (Phosphore) → développement racines\n• K (Potassium) → qualité des fruits\nBlé : NPK 15-15-15 (200 kg/ha) + Urée (100 kg/ha) en tallage. Faites une analyse de sol avant traitement." },
  { mots:['récolte','maturit','cueill','moisson'], rep:"📅 **Calendrier de récolte Tunisie** :\n• Blé dur : Juin-Juillet\n• Tomates : Mars-Mai & Septembre-Octobre\n• Oliviers : Octobre-Décembre\n• Piments : Février-Avril\n• Pommes de terre : Avril-Mai\nIndicateurs : couleur, taux de sucre, matière sèche." },
  { mots:['météo','pluie','vent','chaleur','frost','gel'], rep:"🌤 **Conseils météo agricoles** :\n• <10°C : Couvrez les jeunes plants et les semis\n• >35°C : Irriguez tôt, mulch pour conserver l'humidité\n• Vent >40km/h : Évitez les traitements phytosanitaires\n• Pluie prévue : Reportez la fertilisation azotée de 48h" },
  { mots:['semence','semis','plant','graine'], rep:"🌱 **Calendrier de semis Tunisie** :\n• Blé dur : Octobre-Novembre\n• Tomates : Janvier-Février (pépinière), Mars-Avril (plein champ)\n• Piment : Décembre-Janvier (pépinière)\n• Maïs : Mars-Avril\nProfondeur de semis : 2-3x la taille de la graine." },
  { mots:['pesticide','insecticide','ravageur','puceron','chenille'], rep:"🧪 **Lutte intégrée contre les ravageurs** :\n• Pucerons → Pyrèthre naturel ou savon insecticide\n• Chenilles → Bacillus thuringiensis (bio)\n• Mouche blanche → Pièges jaunes + Imidaclopride\nToujours traiter tôt le matin ou en soirée. Respectez les délais avant récolte." },
  { mots:['prix','vendre','marché','vente','export'], rep:"💰 **Prix moyens marché tunisien (2026)** :\n• Blé dur : 650-700 DT/tonne\n• Tomates : 0.4-0.8 DT/kg\n• Huile d'olive : 12-18 DT/litre\n• Piments rouges : 1.2-2 DT/kg\nConseil : Vendez hors période de pointe pour maximiser votre marge." },
];