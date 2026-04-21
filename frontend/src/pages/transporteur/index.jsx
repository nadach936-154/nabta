// src/pages/transporteur/index.jsx
// ✅ BUG 6 corrigé : transporteur reçoit les messages et demandes en temps réel
import { useState, useEffect } from 'react';
import { StatCard, Badge, Card, SectionTitle, Table, PageHeader, Btn } from '../../components/UI';
import { messageStore, notifStore } from '../../store/notifications';
import { useAuth } from '../../context/AuthContext';

const MOCK_LIVRAISONS = [];

const NEXT_STATUT = { en_attente:'confirme', confirme:'en_cours', en_cours:'livre' };
const NEXT_LABEL  = { confirme:'✓ Confirmer', en_cours:'▶ Démarrer', livre:'✅ Livré' };

/* ═══════════════ DASHBOARD ═══════════════════════════════════════════════ */
export function DashboardTransporteur() {
  const { user } = useAuth();
  const [livraisons,  setLivraisons]  = useState(MOCK_LIVRAISONS);
  const [messages,    setMessages]    = useState([]);
  const [notifs,      setNotifs]      = useState([]);
  const [msgOuvert,   setMsgOuvert]   = useState(null);

  const charger = () => {
    const email = (user?.email||'').toLowerCase();
    setMessages(messageStore.reçus(email));
    setNotifs(notifStore.unread(email));
  };

  useEffect(() => {
    charger();
    const t = setInterval(charger, 2500); // polling 2.5s
    return () => clearInterval(t);
  // eslint-disable-next-line
  }, [user?.email]);

  const ouvrirMsg = (msg) => {
    messageStore.marquerLu(msg.id);
    setMsgOuvert(msg);
    charger();
  };

  const avancer = (id) => {
    setLivraisons(prev => prev.map(l => {
      if (l.id !== id) return l;
      const next = NEXT_STATUT[l.statut];
      return next ? { ...l, statut: next } : l;
    }).filter(Boolean));
  };

  const msgsNonLus = messages.filter(m => !m.lu);

  return (
    <div>
      <PageHeader title={`Bonjour, ${user?.nom?.split(' ')[0]} 🚚`} subtitle="Vue d'ensemble de vos livraisons" />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Livraisons"   value={livraisons.length}                                    icon="📦" color="#3b82f6" />
        <StatCard label="En cours"     value={livraisons.filter(l=>l.statut==='en_cours').length}   icon="🚚" color="#f97316" />
        <StatCard label="Messages"     value={messages.length} sub={msgsNonLus.length>0?`${msgsNonLus.length} non lu(s)`:'Tous lus'} icon="✉️" color="#2563eb" />
        <StatCard label="Notifications"value={notifs.length}   sub="Non lues"                       icon="🔔" color="#7c3aed" />
      </div>

      {/* Notifications */}
      {notifs.length > 0 && (
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'12px 18px', marginBottom:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <p style={{ margin:0, fontWeight:700, color:'#2563eb', fontSize:14 }}>🔔 {notifs.length} nouvelle(s) notification(s)</p>
            <button onClick={() => { notifStore.markAllRead(user?.email); charger(); }}
              style={{ fontSize:12, color:'#2563eb', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
              Tout marquer lu
            </button>
          </div>
          {notifs.slice(0,3).map(n => (
            <div key={n.id} style={{ background:'#fff', borderRadius:8, padding:'8px 12px', marginBottom:5, fontSize:13, display:'flex', gap:8 }}>
              <span>{n.type==='message'?'✉️':n.type==='commande'?'🛒':'📋'}</span>
              <div><p style={{ margin:0, fontWeight:600 }}>{n.titre}</p><p style={{ margin:0, color:'#888', fontSize:12 }}>{n.message}</p></div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Livraisons */}
        <Card>
          <SectionTitle>Livraisons actives</SectionTitle>
          {livraisons.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'#aaa' }}>
              <p style={{ fontSize:32 }}>🚚</p>
              <p style={{ fontWeight:600, color:'#555', fontSize:14 }}>Aucune livraison active</p>
              <p style={{ fontSize:12 }}>Les demandes de livraison apparaîtront ici</p>
            </div>
          ) : livraisons.slice(0,5).map(l => (
            <div key={l.id} style={{ padding:'10px 0', borderBottom:'1px solid #f9f9f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:500 }}>{l.produit}</p>
                <p style={{ margin:0, fontSize:12, color:'#888' }}>📍{l.from} → 🏁{l.to}</p>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <Badge statut={l.statut} />
                {NEXT_STATUT[l.statut] && (
                  <button onClick={() => avancer(l.id)}
                    style={{ fontSize:11, background:'#f0fdf4', color:'#16a34a', border:'none', borderRadius:5, padding:'3px 8px', cursor:'pointer' }}>
                    {NEXT_LABEL[NEXT_STATUT[l.statut]]}
                  </button>
                )}
              </div>
            </div>
          ))}
        </Card>

        {/* ✅ BUG 6 : Messages reçus */}
        <Card>
          <SectionTitle>
            ✉️ Messages reçus
            {msgsNonLus.length > 0 && (
              <span style={{ marginLeft:8, fontSize:11, background:'#dc2626', color:'#fff', borderRadius:10, padding:'2px 7px', fontWeight:700 }}>
                {msgsNonLus.length}
              </span>
            )}
          </SectionTitle>
          {messages.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'#aaa' }}>
              <p style={{ fontSize:32 }}>✉️</p>
              <p style={{ fontWeight:600, color:'#555', fontSize:14 }}>Aucun message</p>
              <p style={{ fontSize:12 }}>Les messages des agriculteurs apparaîtront ici</p>
            </div>
          ) : messages.slice(0,5).map(m => (
            <div key={m.id} onClick={() => ouvrirMsg(m)}
              style={{ padding:'10px 0', borderBottom:'1px solid #f9f9f9', cursor:'pointer', background:m.lu?'transparent':'#f0f9ff', borderRadius:6, paddingLeft:m.lu?0:8 }}>
              <div style={{ display:'flex', gap:8 }}>
                {!m.lu && <div style={{ width:7, height:7, borderRadius:'50%', background:'#2563eb', flexShrink:0, marginTop:5 }} />}
                <div style={{ flex:1 }}>
                  <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:m.lu?400:700 }}>{m.deNom}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.contenu}</p>
                  <p style={{ margin:0, fontSize:10, color:'#bbb' }}>
                    {new Date(m.at).toLocaleString('fr-FR',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Modal message */}
      {msgOuvert && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:460, width:'90%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <h3 style={{ margin:'0 0 3px', fontSize:16 }}>✉️ {msgOuvert.deNom}</h3>
                <p style={{ margin:0, fontSize:12, color:'#888' }}>{msgOuvert.de}</p>
              </div>
              <button onClick={() => setMsgOuvert(null)} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ background:'#f7f8fa', borderRadius:10, padding:'14px', marginBottom:14, fontSize:14, lineHeight:1.7 }}>{msgOuvert.contenu}</div>
            <p style={{ margin:'0 0 14px', fontSize:12, color:'#aaa' }}>{new Date(msgOuvert.at).toLocaleString('fr-FR')}</p>
            <button onClick={() => setMsgOuvert(null)} style={{ width:'100%', padding:'9px', border:'1px solid #e8e8e8', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer' }}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function LivraisonsTransporteur() {
  const [livraisons, setLivraisons] = useState(MOCK_LIVRAISONS);
  return (
    <div>
      <PageHeader title="Mes Livraisons" />
      <Card>
        {livraisons.length === 0 ? (
          <div style={{ textAlign:'center', padding:48, color:'#aaa' }}>
            <p style={{ fontSize:40 }}>🚚</p>
            <p style={{ fontWeight:600, color:'#555' }}>Aucune livraison active</p>
          </div>
        ) : (
          <Table
            headers={['Produit','De','Vers','Total','Statut']}
            rows={livraisons.map(l => (
              <tr key={l.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
                <td style={{ padding:'11px 0', fontWeight:500 }}>{l.produit}</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>📍{l.from}</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>🏁{l.to}</td>
                <td style={{ padding:'11px 0', fontWeight:700 }}>{l.total?.toLocaleString()} DT</td>
                <td style={{ padding:'11px 0' }}><Badge statut={l.statut} /></td>
              </tr>
            ))}
          />
        )}
      </Card>
    </div>
  );
}

export function DemandesTransporteur() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const c = () => setMessages(messageStore.reçus(user?.email));
    c();
    const t = setInterval(c, 2500);
    return () => clearInterval(t);
  }, [user?.email]);

  return (
    <div>
      <PageHeader title="Demandes reçues" subtitle={`${messages.length} message(s)`} />
      {messages.length === 0 ? (
        <Card>
          <div style={{ textAlign:'center', padding:48, color:'#aaa' }}>
            <p style={{ fontSize:40 }}>📬</p>
            <p style={{ fontWeight:600, color:'#555' }}>Aucune demande reçue</p>
            <p style={{ fontSize:13 }}>Les messages des agriculteurs apparaîtront ici en temps réel</p>
          </div>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {messages.map(m => (
            <Card key={m.id}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:15 }}>{m.deNom}</p>
                  <p style={{ margin:'0 0 6px', fontSize:13, color:'#888' }}>📧 {m.de}</p>
                  <p style={{ margin:0, fontSize:14, color:'#333', lineHeight:1.6 }}>{m.contenu}</p>
                </div>
                <div style={{ flexShrink:0, marginLeft:14 }}>
                  {!m.lu && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:'#dbeafe', color:'#2563eb', fontWeight:700 }}>Nouveau</span>}
                  <p style={{ margin:'6px 0 0', fontSize:11, color:'#aaa' }}>
                    {new Date(m.at).toLocaleString('fr-FR',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function HistoriqueTransporteur() {
  return (
    <div>
      <PageHeader title="Historique" />
      <Card>
        <div style={{ textAlign:'center', padding:48, color:'#aaa' }}>
          <p style={{ fontSize:40 }}>🕐</p>
          <p style={{ fontWeight:600, color:'#555' }}>Historique vide</p>
          <p style={{ fontSize:13 }}>Vos livraisons terminées apparaîtront ici</p>
        </div>
      </Card>
    </div>
  );
}