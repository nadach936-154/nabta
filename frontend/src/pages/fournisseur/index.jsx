// src/pages/fournisseur/index.jsx
// ✅ CORRECTIONS : dashboard affiche messages reçus + commandes en temps réel
import { useState, useEffect } from 'react';
import { StatCard, Badge, Card, SectionTitle, Table, PageHeader, Btn } from '../../components/UI';
import { commandeStore, messageStore, notifStore } from '../../store/notifications';
import { useAuth } from '../../context/AuthContext';

/* ── DASHBOARD FOURNISSEUR ───────────────────────────────────────────────── */
export function DashboardFournisseur() {
  const { user } = useAuth();
  const [commandes,  setCommandes]  = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [notifs,     setNotifs]     = useState([]);
  const [msgOuvert,  setMsgOuvert]  = useState(null);

  const charger = () => {
    const email = (user?.email || '').toLowerCase();
    setCommandes(commandeStore.pourVendeur(email));
    setMessages(messageStore.reçus(email));
    setNotifs(notifStore.unread(email));
  };

  useEffect(() => {
    charger();
    const t = setInterval(charger, 2500); // polling 2.5s
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const avancer = (id, s) => {
    commandeStore.update(id, { statut: s });
    charger();
  };

  const ouvrirMsg = (msg) => {
    messageStore.marquerLu(msg.id);
    setMsgOuvert(msg);
    charger();
  };

  const enAttente = commandes.filter(c => c.statut === 'en_attente');
  const nonLus    = messages.filter(m => !m.lu);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 3px', color:'#111' }}>
            Bonjour, {user?.nom?.split(' ')[0]} 🏪
          </h2>
          <p style={{ color:'#888', margin:0, fontSize:14 }}>Vue d'ensemble de votre activité</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Commandes reçues" value={commandes.length}   sub="Total"       icon="🛒" color="#b45309" />
        <StatCard label="En attente"        value={enAttente.length}  sub="À traiter"   icon="⏳" color="#f97316" />
        <StatCard label="Messages reçus"    value={messages.length}   sub={nonLus.length>0?`${nonLus.length} non lu(s)`:'Tous lus'} icon="✉️" color="#2563eb" />
        <StatCard label="Livrées"           value={commandes.filter(c=>c.statut==='livree').length} sub="Terminées" icon="✅" color="#16a34a" />
      </div>

      {/* Notifications */}
      {notifs.length > 0 && (
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'12px 18px', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <p style={{ margin:0, fontWeight:700, color:'#2563eb', fontSize:14 }}>
              🔔 {notifs.length} nouvelle(s) notification(s)
            </p>
            <button onClick={() => { notifStore.markAllRead(user?.email); charger(); }}
              style={{ fontSize:12, color:'#2563eb', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
              Tout marquer lu
            </button>
          </div>
          {notifs.slice(0, 3).map(n => (
            <div key={n.id} style={{ background:'#fff', borderRadius:8, padding:'8px 12px', marginBottom:5, fontSize:13, display:'flex', gap:8 }}>
              <span>{n.type==='commande'?'🛒':n.type==='message'?'✉️':'📅'}</span>
              <div>
                <p style={{ margin:0, fontWeight:600 }}>{n.titre}</p>
                <p style={{ margin:0, color:'#888', fontSize:12 }}>{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nouvelles commandes */}
      {enAttente.length > 0 && (
        <Card style={{ marginBottom:20 }}>
          <SectionTitle>🛒 Nouvelles commandes ({enAttente.length})</SectionTitle>
          {enAttente.map(c => (
            <div key={c.id} style={{ background:'#fefce8', border:'1px solid #fde68a', borderRadius:9, padding:'10px 14px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
              <div>
                <p style={{ margin:'0 0 2px', fontWeight:600 }}>{c.produitNom || c.produit}</p>
                <p style={{ margin:0, color:'#888' }}>
                  👤 {c.acheteurNom} · {c.qte} unité(s) · 📍 {c.adresse || '—'}
                </p>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <strong style={{ color:'#16a34a' }}>{(c.total||0).toLocaleString()} DT</strong>
                <button onClick={() => avancer(c.id, 'traitement')}
                  style={{ background:'#b45309', color:'#fff', border:'none', borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  Traiter →
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Toutes les commandes */}
        <Card>
          <SectionTitle>Toutes les commandes</SectionTitle>
          {commandes.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'#aaa' }}>
              <p style={{ fontSize:32 }}>🛒</p>
              <p style={{ fontWeight:600, color:'#555', fontSize:14 }}>Aucune commande</p>
              <p style={{ fontSize:12 }}>Mise à jour automatique</p>
            </div>
          ) : commandes.slice(0, 5).map(c => {
            const ns = { en_attente:'traitement', traitement:'expediee', expediee:'livree' }[c.statut];
            return (
              <div key={c.id} style={{ padding:'10px 0', borderBottom:'1px solid #f9f9f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:500 }}>{c.produitNom || c.produit}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>
                    {c.acheteurNom} · {c.qte} u.
                  </p>
                </div>
                <div style={{ display:'flex', gap:7, alignItems:'center' }}>
                  <Badge statut={c.statut} />
                  {ns && (
                    <button onClick={() => avancer(c.id, ns)}
                      style={{ fontSize:11, background:'#f0fdf4', color:'#16a34a', border:'none', borderRadius:5, padding:'3px 8px', cursor:'pointer' }}>
                      →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </Card>

        {/* Messages reçus ✅ NOUVEAU */}
        <Card>
          <SectionTitle>
            ✉️ Messages reçus
            {nonLus.length > 0 && (
              <span style={{ marginLeft:8, fontSize:11, background:'#dc2626', color:'#fff', borderRadius:10, padding:'2px 7px', fontWeight:700 }}>
                {nonLus.length} nouveau(x)
              </span>
            )}
          </SectionTitle>
          {messages.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'#aaa' }}>
              <p style={{ fontSize:32 }}>✉️</p>
              <p style={{ fontWeight:600, color:'#555', fontSize:14 }}>Aucun message</p>
              <p style={{ fontSize:12 }}>Les messages des agriculteurs apparaîtront ici</p>
            </div>
          ) : messages.slice(0, 5).map(m => (
            <div key={m.id}
              onClick={() => ouvrirMsg(m)}
              style={{ padding:'10px 0', borderBottom:'1px solid #f9f9f9', cursor:'pointer', background:m.lu?'transparent':'#f0f9ff', borderRadius:6, paddingLeft:m.lu?0:8 }}>
              <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                {!m.lu && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb', flexShrink:0, marginTop:5 }} />}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:m.lu?400:700, color:'#111' }}>
                    {m.deNom}
                  </p>
                  <p style={{ margin:0, fontSize:12, color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {m.contenu}
                  </p>
                  <p style={{ margin:0, fontSize:10, color:'#bbb' }}>
                    {new Date(m.at).toLocaleString('fr-FR', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Modal message ouvert */}
      {msgOuvert && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:460, width:'90%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <h3 style={{ margin:'0 0 3px', fontSize:16, fontWeight:700 }}>✉️ Message de {msgOuvert.deNom}</h3>
                <p style={{ margin:0, fontSize:12, color:'#888' }}>{msgOuvert.deEmail}</p>
              </div>
              <button onClick={() => setMsgOuvert(null)}
                style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ background:'#f7f8fa', borderRadius:10, padding:'14px', marginBottom:16, fontSize:14, color:'#333', lineHeight:1.7 }}>
              {msgOuvert.contenu}
            </div>
            <p style={{ margin:'0 0 16px', fontSize:12, color:'#aaa' }}>
              Reçu le {new Date(msgOuvert.at).toLocaleString('fr-FR')}
            </p>
            {msgOuvert.deEmail && (
              <div style={{ display:'flex', gap:8 }}>
                <a href={`mailto:${msgOuvert.deEmail}`}
                  style={{ flex:1, background:'#eff6ff', color:'#2563eb', borderRadius:8, padding:'9px', fontSize:13, fontWeight:600, textDecoration:'none', textAlign:'center' }}>
                  ↩️ Répondre par email
                </a>
                <button onClick={() => setMsgOuvert(null)}
                  style={{ padding:'9px 16px', border:'1px solid #e8e8e8', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer' }}>
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── STOCK ─────────────────────────────────────────────────────────────────── */
export function StockFournisseur() {
  const produits = [
    { nom:'Engrais Bio Premium',   cat:'Engrais',    prix:450,  qte:150, statut:'stock'   },
    { nom:'Semences de Blé',        cat:'Semences',   prix:320,  qte:45,  statut:'bas'     },
    { nom:'Pesticide Naturel',       cat:'Protection', prix:280,  qte:0,   statut:'rupture' },
    { nom:"Système d'Irrigation",  cat:'Équipement', prix:1200, qte:85,  statut:'stock'   },
  ];

  return (
    <div>
      <PageHeader title="Gestion du Stock" subtitle="Niveaux de stock de vos produits" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:22 }}>
        <StatCard label="En stock"  value={produits.filter(p=>p.statut==='stock').length}   icon="📦" color="#16a34a" />
        <StatCard label="Stock bas" value={produits.filter(p=>p.statut==='bas').length}     icon="⚠️" color="#f97316" />
        <StatCard label="Rupture"   value={produits.filter(p=>p.statut==='rupture').length} icon="🚨" color="#dc2626" />
      </div>
      <Card>
        <Table
          headers={['Produit','Catégorie','Prix','Quantité','Statut']}
          rows={produits.map((p,i) => (
            <tr key={i} style={{ borderBottom:'1px solid #f9f9f9' }}>
              <td style={{ padding:'11px 0', fontWeight:600 }}>{p.nom}</td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{p.cat}</td>
              <td style={{ padding:'11px 0', fontWeight:700, color:'#b45309' }}>{p.prix} DT</td>
              <td style={{ padding:'11px 0' }}>{p.qte}</td>
              <td style={{ padding:'11px 0' }}><Badge statut={p.statut} /></td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}