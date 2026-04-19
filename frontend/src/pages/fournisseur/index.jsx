// src/pages/fournisseur/index.jsx
// ✅ Dashboard avec commandes + messages + demandes (accepter/refuser)
import { useState, useEffect } from 'react';
import { StatCard, Badge, Card, SectionTitle, PageHeader, Table, Btn } from '../../components/UI';
import { commandeStore, messageStore, demandeStore, notifStore } from '../../store/notifications';
import { useAuth } from '../../context/AuthContext';

export function DashboardFournisseur() {
  const { user } = useAuth();
  const [commandes,  setCommandes]  = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [demandes,   setDemandes]   = useState([]);
  const [notifs,     setNotifs]     = useState([]);
  const [msgOuvert,  setMsgOuvert]  = useState(null);
  const [demOuvert,  setDemOuvert]  = useState(null);

  const charger = () => {
    const email = (user?.email||'').toLowerCase();
    setCommandes(commandeStore.pourVendeur(email));
    setMessages(messageStore.reçus(email));
    setDemandes(demandeStore.pourFournisseur(email));
    setNotifs(notifStore.unread(email));
  };

  useEffect(() => {
    charger();
    const t = setInterval(charger, 2500);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const avancerCommande = (id, s) => { commandeStore.update(id, { statut:s }); charger(); };
  const accepterDemande = (id) => { demandeStore.update(id, { statut:'acceptee' }); charger(); };
  const refuserDemande  = (id) => { demandeStore.update(id, { statut:'refusee'  }); charger(); };
  const ouvrirMsg = (msg) => { messageStore.marquerLu(msg.id); setMsgOuvert(msg); charger(); };

  const enAttente   = commandes.filter(c => c.statut==='en_attente');
  const demandesNew = demandes.filter(d => d.statut==='en_attente');
  const msgsNonLus  = messages.filter(m => !m.lu);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 3px', color:'#111' }}>Bonjour, {user?.nom?.split(' ')[0]} 🏪</h2>
          <p style={{ color:'#888', margin:0, fontSize:14 }}>Vue d'ensemble — mise à jour automatique</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        <StatCard label="Commandes"   value={commandes.length}       sub={enAttente.length>0?`${enAttente.length} en attente`:'Toutes traitées'} icon="🛒" color="#b45309" />
        <StatCard label="Demandes"    value={demandes.length}        sub={demandesNew.length>0?`${demandesNew.length} à traiter`:'Toutes traitées'} icon="📋" color="#7c3aed" />
        <StatCard label="Messages"    value={messages.length}        sub={msgsNonLus.length>0?`${msgsNonLus.length} non lu(s)`:'Tous lus'}      icon="✉️" color="#2563eb" />
        <StatCard label="Livrées"     value={commandes.filter(c=>c.statut==='livree').length} sub="Terminées" icon="✅" color="#16a34a" />
      </div>

      {/* Notifications */}
      {notifs.length > 0 && (
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'12px 18px', marginBottom:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <p style={{ margin:0, fontWeight:700, color:'#2563eb', fontSize:14 }}>🔔 {notifs.length} nouvelle(s)</p>
            <button onClick={() => { notifStore.markAllRead(user?.email); charger(); }}
              style={{ fontSize:12, color:'#2563eb', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
              Tout marquer lu
            </button>
          </div>
          {notifs.slice(0,3).map(n => (
            <div key={n.id} style={{ background:'#fff', borderRadius:8, padding:'8px 12px', marginBottom:5, fontSize:13, display:'flex', gap:8 }}>
              <span>{n.type==='commande'?'🛒':n.type==='demande'?'📋':n.type==='message'?'✉️':'📅'}</span>
              <div><p style={{ margin:0, fontWeight:600 }}>{n.titre}</p><p style={{ margin:0, color:'#888', fontSize:12 }}>{n.message}</p></div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* ── Commandes ── */}
        <Card>
          <SectionTitle>🛒 Commandes reçues</SectionTitle>
          {commandes.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'#aaa' }}>
              <p style={{ fontSize:32 }}>🛒</p><p style={{ fontWeight:600, color:'#555', fontSize:14 }}>Aucune commande</p>
            </div>
          ) : commandes.slice(0,5).map(c => {
            const ns = { en_attente:'traitement', traitement:'expediee', expediee:'livree' }[c.statut];
            return (
              <div key={c.id} style={{ padding:'10px 0', borderBottom:'1px solid #f9f9f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ flex:1 }}>
                  <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:600 }}>{c.produitNom||c.produit}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>{c.acheteurNom} · {c.qte} u. · {(c.total||0).toLocaleString()} DT</p>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <Badge statut={c.statut} />
                  {ns && <button onClick={() => avancerCommande(c.id,ns)} style={{ fontSize:11, background:'#f0fdf4', color:'#16a34a', border:'none', borderRadius:5, padding:'3px 8px', cursor:'pointer' }}>→</button>}
                </div>
              </div>
            );
          })}
        </Card>

        {/* ── Demandes ✅ NOUVEAU ── */}
        <Card>
          <SectionTitle>
            📋 Demandes reçues
            {demandesNew.length > 0 && <span style={{ marginLeft:8, fontSize:11, background:'#7c3aed', color:'#fff', borderRadius:10, padding:'2px 7px', fontWeight:700 }}>{demandesNew.length} nouveau(x)</span>}
          </SectionTitle>
          {demandes.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'#aaa' }}>
              <p style={{ fontSize:32 }}>📋</p><p style={{ fontWeight:600, color:'#555', fontSize:14 }}>Aucune demande</p>
              <p style={{ fontSize:12 }}>Les demandes des agriculteurs apparaîtront ici</p>
            </div>
          ) : demandes.slice(0,5).map(d => (
            <div key={d.id} style={{ padding:'10px 0', borderBottom:'1px solid #f9f9f9' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:600 }}>{d.objet}</p>
                  <p style={{ margin:'0 0 2px', fontSize:12, color:'#888' }}>👤 {d.demandeurNom}</p>
                  <p style={{ margin:0, fontSize:11, color:'#aaa', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.message.slice(0,50)}...</p>
                </div>
                <button onClick={() => setDemOuvert(d)} style={{ fontSize:11, color:'#7c3aed', background:'#f5f3ff', border:'none', borderRadius:5, padding:'3px 8px', cursor:'pointer', marginLeft:8, flexShrink:0 }}>Voir</button>
              </div>
              {d.statut === 'en_attente' && (
                <div style={{ display:'flex', gap:7, marginTop:8 }}>
                  <button onClick={() => accepterDemande(d.id)} style={{ flex:1, background:'#16a34a', color:'#fff', border:'none', borderRadius:7, padding:'5px', fontSize:12, fontWeight:600, cursor:'pointer' }}>✓ Accepter</button>
                  <button onClick={() => refuserDemande(d.id)}  style={{ flex:1, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:7, padding:'5px', fontSize:12, fontWeight:600, cursor:'pointer' }}>✗ Refuser</button>
                </div>
              )}
              {d.statut !== 'en_attente' && (
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:600, background:d.statut==='acceptee'?'#dcfce7':'#fee2e2', color:d.statut==='acceptee'?'#16a34a':'#dc2626' }}>
                  {d.statut==='acceptee' ? '✓ Acceptée' : '✗ Refusée'}
                </span>
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <SectionTitle>
          ✉️ Messages reçus
          {msgsNonLus.length > 0 && <span style={{ marginLeft:8, fontSize:11, background:'#dc2626', color:'#fff', borderRadius:10, padding:'2px 7px', fontWeight:700 }}>{msgsNonLus.length} non lu(s)</span>}
        </SectionTitle>
        {messages.length === 0 ? (
          <div style={{ textAlign:'center', padding:24, color:'#aaa' }}>
            <p style={{ fontSize:28 }}>✉️</p><p style={{ fontWeight:600, color:'#555' }}>Aucun message</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10 }}>
            {messages.slice(0,6).map(m => (
              <div key={m.id} onClick={() => ouvrirMsg(m)}
                style={{ padding:'10px 12px', borderRadius:9, border:'1px solid #e8e8e8', cursor:'pointer', background:m.lu?'#fff':'#f0f9ff', transition:'all 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ display:'flex', gap:6, alignItems:'flex-start' }}>
                  {!m.lu && <div style={{ width:7, height:7, borderRadius:'50%', background:'#2563eb', flexShrink:0, marginTop:4 }} />}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:m.lu?400:700 }}>{m.deNom}</p>
                    <p style={{ margin:0, fontSize:12, color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.contenu}</p>
                    <p style={{ margin:0, fontSize:10, color:'#bbb' }}>{new Date(m.at).toLocaleString('fr-FR',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal message */}
      {msgOuvert && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:460, width:'90%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <div><h3 style={{ margin:'0 0 3px', fontSize:16 }}>✉️ {msgOuvert.deNom}</h3><p style={{ margin:0, fontSize:12, color:'#888' }}>{msgOuvert.deEmail}</p></div>
              <button onClick={() => setMsgOuvert(null)} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ background:'#f7f8fa', borderRadius:10, padding:'14px', marginBottom:14, fontSize:14, lineHeight:1.7 }}>{msgOuvert.contenu}</div>
            <p style={{ margin:'0 0 14px', fontSize:12, color:'#aaa' }}>{new Date(msgOuvert.at).toLocaleString('fr-FR')}</p>
            <div style={{ display:'flex', gap:8 }}>
              {msgOuvert.deEmail && <a href={`mailto:${msgOuvert.deEmail}`} style={{ flex:1, background:'#eff6ff', color:'#2563eb', borderRadius:8, padding:'9px', fontSize:13, fontWeight:600, textDecoration:'none', textAlign:'center' }}>↩️ Répondre</a>}
              <button onClick={() => setMsgOuvert(null)} style={{ padding:'9px 16px', border:'1px solid #e8e8e8', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal demande détail */}
      {demOuvert && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:480, width:'90%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <div><h3 style={{ margin:'0 0 3px', fontSize:16 }}>📋 {demOuvert.objet}</h3><p style={{ margin:0, fontSize:12, color:'#888' }}>De {demOuvert.demandeurNom}</p></div>
              <button onClick={() => setDemOuvert(null)} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ background:'#f7f8fa', borderRadius:9, padding:'12px 14px', marginBottom:14, fontSize:13 }}>
              <p style={{ margin:'0 0 3px', fontWeight:600 }}>{demOuvert.demandeurNom}</p>
              {demOuvert.demandeurTel && <p style={{ margin:'0 0 3px', color:'#666' }}>📞 {demOuvert.demandeurTel}</p>}
              {demOuvert.demandeurAdr && <p style={{ margin:0, color:'#666' }}>📍 {demOuvert.demandeurAdr}</p>}
            </div>
            <div style={{ background:'#f0f0f0', borderRadius:9, padding:'12px 14px', marginBottom:16, fontSize:14, lineHeight:1.7 }}>{demOuvert.message}</div>
            {demOuvert.statut === 'en_attente' ? (
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => { accepterDemande(demOuvert.id); setDemOuvert(null); charger(); }}
                  style={{ flex:1, background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  ✓ Accepter la demande
                </button>
                <button onClick={() => { refuserDemande(demOuvert.id); setDemOuvert(null); charger(); }}
                  style={{ flex:1, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  ✗ Refuser
                </button>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'10px 0' }}>
                <span style={{ fontSize:14, padding:'6px 16px', borderRadius:20, fontWeight:700, background:demOuvert.statut==='acceptee'?'#dcfce7':'#fee2e2', color:demOuvert.statut==='acceptee'?'#16a34a':'#dc2626' }}>
                  {demOuvert.statut==='acceptee' ? '✓ Demande acceptée' : '✗ Demande refusée'}
                </span>
              </div>
            )}
            {demOuvert.statut !== 'en_attente' && <button onClick={() => setDemOuvert(null)} style={{ width:'100%', marginTop:10, padding:'9px', border:'1px solid #e8e8e8', borderRadius:9, background:'#fff', fontSize:13, cursor:'pointer' }}>Fermer</button>}
          </div>
        </div>
      )}
    </div>
  );
}

export function StockFournisseur() {
  const produits = [
    { nom:'Engrais Bio Premium',   cat:'Engrais',    prix:450,  qte:150, statut:'stock'   },
    { nom:'Semences de Blé',        cat:'Semences',   prix:320,  qte:45,  statut:'bas'     },
    { nom:'Pesticide Naturel',       cat:'Protection', prix:280,  qte:0,   statut:'rupture' },
    { nom:"Système d'Irrigation",  cat:'Équipement', prix:1200, qte:85,  statut:'stock'   },
  ];
  return (
    <div>
      <PageHeader title="Gestion du Stock" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
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