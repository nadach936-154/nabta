// src/store/notifications.js
// Système partagé entre tous les utilisateurs via localStorage

const KEYS = {
  rdv:      'nabta_rdv_v2',
  notifs:   'nabta_notifs_v2',
  commandes:'nabta_commandes_v2',
  produits: 'nabta_produits_v2',
};

// ─── RDV Store ────────────────────────────────────────────────────────────────
export const rdvStore = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(KEYS.rdv) || '[]'); }
    catch { return []; }
  },
  save(list) {
    localStorage.setItem(KEYS.rdv, JSON.stringify(list));
  },
  envoyer(data) {
    const list = this.getAll();
    const rdv = {
      ...data,
      id:        'rdv_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
      statut:    'en_attente',
      createdAt: new Date().toISOString(),
    };
    list.push(rdv);
    this.save(list);
    // Notification pour le vétérinaire
    notifStore.add({
      pour:    data.vetEmail,
      type:    data.urgent ? 'urgence' : 'rdv',
      titre:   data.urgent ? '🚨 CAS URGENT reçu !' : '📅 Nouvelle demande de RDV',
      message: `De ${data.agriNom} — ${data.animal}`,
      refId:   rdv.id,
    });
    return rdv;
  },
  pourVet(email) {
    return this.getAll().filter(r => r.vetEmail === email);
  },
  update(id, changes) {
    const list = this.getAll().map(r => r.id === id ? { ...r, ...changes } : r);
    this.save(list);
  },
};

// ─── Notifications Store ──────────────────────────────────────────────────────
export const notifStore = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(KEYS.notifs) || '[]'); }
    catch { return []; }
  },
  save(list) {
    localStorage.setItem(KEYS.notifs, JSON.stringify(list));
  },
  add(data) {
    const list = this.getAll();
    list.unshift({
      ...data,
      id:  'n_' + Date.now(),
      lu:  false,
      at:  new Date().toISOString(),
    });
    this.save(list);
  },
  forUser(email) {
    return this.getAll().filter(n => n.pour === email);
  },
  unread(email) {
    return this.forUser(email).filter(n => !n.lu);
  },
  markAllRead(email) {
    const list = this.getAll().map(n =>
      n.pour === email ? { ...n, lu: true } : n
    );
    this.save(list);
  },
};

// ─── Commandes Marketplace ────────────────────────────────────────────────────
export const commandeStore = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(KEYS.commandes) || '[]'); }
    catch { return []; }
  },
  save(list) {
    localStorage.setItem(KEYS.commandes, JSON.stringify(list));
  },
  passer(data) {
    const list = this.getAll();
    const cmd = {
      ...data,
      id:     'cmd_' + Date.now(),
      statut: 'en_attente',
      at:     new Date().toISOString(),
    };
    list.unshift(cmd);
    this.save(list);
    // Notifier le vendeur
    notifStore.add({
      pour:    data.vendeurEmail,
      type:    'commande',
      titre:   '🛒 Nouvelle commande reçue !',
      message: `${data.acheteurNom} commande "${data.produitNom}" × ${data.qte}`,
      refId:   cmd.id,
    });
    return cmd;
  },
  pourVendeur(email) {
    return this.getAll().filter(c => c.vendeurEmail === email);
  },
  pourAcheteur(email) {
    return this.getAll().filter(c => c.acheteurEmail === email);
  },
  update(id, changes) {
    const list = this.getAll().map(c => c.id === id ? { ...c, ...changes } : c);
    this.save(list);
  },
};

// ─── Produits partagés (publiés par agriculteurs et fournisseurs) ─────────────
export const produitsStore = {
  DEFAUT: [
    { id:'p1', nom:'Engrais Bio Premium',     cat:'Engrais',    prix:450,  qte:150, statut:'stock',   vendeurNom:'Fatima Zahra',   vendeurEmail:'fournisseur@nabta.tn', role:'fournisseur', desc:'NPK 15-15-15 certifié bio' },
    { id:'p2', nom:'Semences de Blé Dur',      cat:'Semences',   prix:320,  qte:45,  statut:'bas',     vendeurNom:'Fatima Zahra',   vendeurEmail:'fournisseur@nabta.tn', role:'fournisseur', desc:'Variété Karim — haut rendement' },
    { id:'p3', nom:'Pesticide Naturel',         cat:'Protection', prix:280,  qte:0,   statut:'rupture', vendeurNom:'Fatima Zahra',   vendeurEmail:'fournisseur@nabta.tn', role:'fournisseur', desc:'Bio — pucerons et acariens' },
    { id:'p4', nom:"Système d'Irrigation",     cat:'Équipement', prix:1200, qte:85,  statut:'stock',   vendeurNom:'Fatima Zahra',   vendeurEmail:'fournisseur@nabta.tn', role:'fournisseur', desc:'Kit goutte-à-goutte 1 ha' },
    { id:'p5', nom:'Maïs Grain — Récolte 2026',cat:'Culture',    prix:12,   qte:500, statut:'stock',   vendeurNom:'Ahmed Bennani',  vendeurEmail:'agriculteur@nabta.tn', role:'agriculteur', desc:'Maïs sec avril 2026' },
    { id:'p6', nom:'Huile d\'Olive Extra',      cat:'Culture',    prix:18,   qte:200, statut:'stock',   vendeurNom:'Ahmed Bennani',  vendeurEmail:'agriculteur@nabta.tn', role:'agriculteur', desc:'Première pression à froid' },
  ],
  getAll() {
    try {
      const saved = localStorage.getItem(KEYS.produits);
      return saved ? JSON.parse(saved) : this.DEFAUT;
    } catch { return this.DEFAUT; }
  },
  save(list) {
    localStorage.setItem(KEYS.produits, JSON.stringify(list));
  },
  add(produit) {
    const list = this.getAll();
    const nouveau = { ...produit, id: 'p_' + Date.now() };
    list.unshift(nouveau);
    this.save(list);
    return nouveau;
  },
  remove(id) {
    const list = this.getAll().filter(p => p.id !== id);
    this.save(list);
  },
};