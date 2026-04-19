// src/store/notifications.js
// ✅ VERSION COMPLÈTE : RDV + Messages + Commandes + Produits + Demandes Fournisseur

const KEYS = {
  rdv:       'nabta_rdv_v2',
  notifs:    'nabta_notifs_v2',
  commandes: 'nabta_commandes_v2',
  produits:  'nabta_produits_v3',   // ← v3 pour reset produits
  messages:  'nabta_messages_v2',
  demandes:  'nabta_demandes_four', // ← NOUVEAU : demandes vers fournisseurs
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const lower = (s) => (s || '').toLowerCase().trim();

// ─── RDV Store ────────────────────────────────────────────────────────────────
export const rdvStore = {
  getAll()  { try { return JSON.parse(localStorage.getItem(KEYS.rdv) || '[]'); } catch { return []; } },
  save(l)   { localStorage.setItem(KEYS.rdv, JSON.stringify(l)); },
  envoyer(data) {
    const list = this.getAll();
    const rdv  = {
      ...data,
      vetEmail:  lower(data.vetEmail),
      agriEmail: lower(data.agriEmail),
      id:        'rdv_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
      statut:    'en_attente',
      createdAt: new Date().toISOString(),
    };
    list.push(rdv);
    this.save(list);
    notifStore.add({
      pour:    rdv.vetEmail,
      type:    data.urgent ? 'urgence' : 'rdv',
      titre:   data.urgent ? '🚨 CAS URGENT reçu !' : '📅 Nouvelle demande de RDV',
      message: `De ${data.agriNom} — ${data.animal}`,
      refId:   rdv.id,
    });
    return rdv;
  },
  pourVet(email) { return this.getAll().filter(r => r.vetEmail === lower(email)); },
  update(id, changes) {
    this.save(this.getAll().map(r => r.id === id ? { ...r, ...changes } : r));
  },
};

// ─── Notifications ─────────────────────────────────────────────────────────────
export const notifStore = {
  getAll()  { try { return JSON.parse(localStorage.getItem(KEYS.notifs) || '[]'); } catch { return []; } },
  save(l)   { localStorage.setItem(KEYS.notifs, JSON.stringify(l)); },
  add(data) {
    const list = this.getAll();
    list.unshift({ ...data, pour: lower(data.pour), id: 'n_' + Date.now(), lu: false, at: new Date().toISOString() });
    this.save(list);
  },
  forUser(email)   { return this.getAll().filter(n => n.pour === lower(email)); },
  unread(email)    { return this.forUser(email).filter(n => !n.lu); },
  markAllRead(email) {
    this.save(this.getAll().map(n => n.pour === lower(email) ? { ...n, lu: true } : n));
  },
};

// ─── Messages entre utilisateurs ──────────────────────────────────────────────
export const messageStore = {
  getAll()  { try { return JSON.parse(localStorage.getItem(KEYS.messages) || '[]'); } catch { return []; } },
  save(l)   { localStorage.setItem(KEYS.messages, JSON.stringify(l)); },
  envoyer(data) {
    const list = this.getAll();
    const msg = {
      id:       'msg_' + Date.now(),
      de:       lower(data.deEmail),
      deNom:    data.deNom   || '',
      vers:     lower(data.versEmail),
      versNom:  data.versNom || '',
      contenu:  data.contenu || '',
      at:       new Date().toISOString(),
      lu:       false,
    };
    list.unshift(msg);
    this.save(list);
    notifStore.add({
      pour:    msg.vers,
      type:    'message',
      titre:   `✉️ Message de ${msg.deNom}`,
      message: msg.contenu.slice(0, 80),
      refId:   msg.id,
    });
    return msg;
  },
  reçus(email)    { return this.getAll().filter(m => m.vers  === lower(email)); },
  envoyés(email)  { return this.getAll().filter(m => m.de    === lower(email)); },
  nonLus(email)   { return this.reçus(email).filter(m => !m.lu); },
  marquerLu(id)   {
    this.save(this.getAll().map(m => m.id === id ? { ...m, lu: true } : m));
  },
};

// ─── Demandes vers Fournisseur ✅ NOUVEAU ─────────────────────────────────────
export const demandeStore = {
  getAll()  { try { return JSON.parse(localStorage.getItem(KEYS.demandes) || '[]'); } catch { return []; } },
  save(l)   { localStorage.setItem(KEYS.demandes, JSON.stringify(l)); },
  envoyer(data) {
    const list = this.getAll();
    const d = {
      id:            'dem_' + Date.now(),
      fourEmail:     lower(data.fourEmail),
      fourNom:       data.fourNom      || '',
      demandeurEmail:lower(data.demandeurEmail),
      demandeurNom:  data.demandeurNom || '',
      demandeurTel:  data.demandeurTel || '',
      demandeurAdr:  data.demandeurAdr || '',
      objet:         data.objet        || '',
      message:       data.message      || '',
      statut:        'en_attente',
      at:            new Date().toISOString(),
    };
    list.push(d);
    this.save(list);
    notifStore.add({
      pour:    d.fourEmail,
      type:    'demande',
      titre:   `📋 Nouvelle demande de ${d.demandeurNom}`,
      message: d.objet,
      refId:   d.id,
    });
    return d;
  },
  pourFournisseur(email) { return this.getAll().filter(d => d.fourEmail === lower(email)); },
  update(id, changes) {
    this.save(this.getAll().map(d => d.id === id ? { ...d, ...changes } : d));
  },
};

// ─── Commandes Marketplace ────────────────────────────────────────────────────
export const commandeStore = {
  getAll()  { try { return JSON.parse(localStorage.getItem(KEYS.commandes) || '[]'); } catch { return []; } },
  save(l)   { localStorage.setItem(KEYS.commandes, JSON.stringify(l)); },
  passer(data) {
    const list = this.getAll();
    const cmd = {
      ...data,
      vendeurEmail:  lower(data.vendeurEmail),
      acheteurEmail: lower(data.acheteurEmail),
      id:     'cmd_' + Date.now(),
      statut: 'en_attente',
      at:     new Date().toISOString(),
    };
    list.unshift(cmd);
    this.save(list);
    notifStore.add({
      pour:    cmd.vendeurEmail,
      type:    'commande',
      titre:   '🛒 Nouvelle commande reçue !',
      message: `${data.acheteurNom} commande "${data.produitNom}" × ${data.qte}`,
      refId:   cmd.id,
    });
    return cmd;
  },
  pourVendeur(email)  { return this.getAll().filter(c => c.vendeurEmail  === lower(email)); },
  pourAcheteur(email) { return this.getAll().filter(c => c.acheteurEmail === lower(email)); },
  update(id, changes) { this.save(this.getAll().map(c => c.id === id ? { ...c, ...changes } : c)); },
};

// ─── Produits partagés ─────────────────────────────────────────────────────────
const PRODUITS_DEFAUT = [
  { id:'p1', nom:'Engrais Bio Premium',      cat:'Engrais',    prix:450,  qte:150, statut:'stock',   vendeurNom:'Loujayen Lahmidi', vendeurEmail:'loujayenfourni@nabta.tn', role:'fournisseur', desc:'NPK 15-15-15 certifié bio' },
  { id:'p2', nom:'Semences de Blé Dur',       cat:'Semences',   prix:320,  qte:45,  statut:'bas',     vendeurNom:'Loujayen Lahmidi', vendeurEmail:'loujayenfourni@nabta.tn', role:'fournisseur', desc:'Variété Karim — haut rendement' },
  { id:'p3', nom:'Pesticide Naturel',          cat:'Protection', prix:280,  qte:0,   statut:'rupture', vendeurNom:'Loujayen Lahmidi', vendeurEmail:'loujayenfourni@nabta.tn', role:'fournisseur', desc:'Bio — pucerons et acariens' },
  { id:'p4', nom:"Système d'Irrigation",      cat:'Équipement', prix:1200, qte:85,  statut:'stock',   vendeurNom:'Loujayen Lahmidi', vendeurEmail:'loujayenfourni@nabta.tn', role:'fournisseur', desc:'Kit goutte-à-goutte 1 ha' },
  { id:'p5', nom:'Maïs Grain — Récolte 2026', cat:'Culture',    prix:12,   qte:500, statut:'stock',   vendeurNom:'Sarah Majjedi',    vendeurEmail:'sarahagri@nabta.tn',      role:'agriculteur', desc:'Maïs sec avril 2026' },
  { id:'p6', nom:"Huile d'Olive Extra",        cat:'Culture',    prix:18,   qte:200, statut:'stock',   vendeurNom:'Sarah Majjedi',    vendeurEmail:'sarahagri@nabta.tn',      role:'agriculteur', desc:'Première pression à froid' },
];

export const produitsStore = {
  getAll() {
    try {
      const s = localStorage.getItem(KEYS.produits);
      return s ? JSON.parse(s) : PRODUITS_DEFAUT;
    } catch { return PRODUITS_DEFAUT; }
  },
  save(l)   { localStorage.setItem(KEYS.produits, JSON.stringify(l)); },
  add(p)    { const l = this.getAll(); const n = { ...p, id:'p_'+Date.now() }; l.unshift(n); this.save(l); return n; },
  remove(id){ this.save(this.getAll().filter(p => p.id !== id)); },
};