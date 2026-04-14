// src/pages/veterinaire/index.jsx
import { useState, useEffect } from 'react';
import { StatCard, Badge, Card, SectionTitle, Table, PageHeader, Btn } from '../../components/UI';
import { MOCK_RAPPORTS_VET } from '../../data/mockData';
import { rdvStore, notifStore } from '../../store/notifications';
import { useAuth } from '../../context/AuthContext';

/* ── Modal détail RDV ─────────────────────────────────────────────────────── */
function ModalDetail({ rdv, onClose, onAccepter, onRefuser }) {
  if (!rdv) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:500, width:'90%', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:700 }}>Détails de la demande</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
        </div>

        {rdv.urgent && (
          <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 14px', marginBottom:14, display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ fontSize:20 }}>🚨</span>
            <p style={{ margin:0, fontWeight:700, color:'#dc2626' }}>CAS URGENT — intervention prioritaire</p>
          </div>
        )}

        {/* Infos médicales */}
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:14, marginBottom:12 }}>
          <p style={{ margin:'0 0 8px', fontWeight:700, fontSize:14, color:'#16a34a' }}>🐾 Informations médicales</p>
          <p style={{ margin:'0 0 4px', fontSize:13 }}>Animal : <strong>{rdv.animal}</strong></p>
          <p style={{ margin:'0 0 4px', fontSize:13 }}>Date souhaitée : <strong>{rdv.date}</strong></p>
          <p style={{ margin:0, fontSize:13, color:'#555', fontStyle:'italic' }}>"{rdv.description}"</p>
        </div>

        {/* Infos agriculteur */}
        <div style={{ background:'#f7f8fa', border:'1px solid #e8e8e8', borderRadius:10, padding:14, marginBottom:18 }}>
          <p style={{ margin:'0 0 8px', fontWeight:700, fontSize:14, color:'#555' }}>👤 Informations de l'éleveur</p>
          <p style={{ margin:'0 0 4px', fontSize:14, fontWeight:600 }}>{rdv.agriNom}</p>
          <p style={{ margin:'0 0 4px', fontSize:13, color:'#666' }}>📞 {rdv.agriTel || '—'}</p>
          <p style={{ margin:'0 0 4px', fontSize:13, color:'#666' }}>📧 {rdv.agriEmail}</p>
          <p style={{ margin:'0 0 10px', fontSize:13, color:'#666' }}>📍 {rdv.agriAdresse || '—'}</p>
          {rdv.agriTel && (
            <a href={`tel:${rdv.agriTel}`} style={{ display:'inline-block', background:'#eff6ff', color:'#2563eb', borderRadius:7, padding:'6px 14px', fontSize:13, fontWeight:600, textDecoration:'none' }}>
              📞 Appeler maintenant
            </a>
          )}
        </div>

        <div style={{ display:'flex', gap:10 }}>
          {rdv.statut === 'en_attente' && (
            <>
              <button onClick={() => { onAccepter(rdv.id); onClose(); }}
                style={{ flex:1, background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                ✓ Accepter
              </button>
              <button onClick={() => { onRefuser(rdv.id); onClose(); }}
                style={{ flex:1, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                ✗ Refuser
              </button>
            </>
          )}
          <button onClick={onClose} style={{ padding:'11px 14px', border:'1px solid #e8e8e8', borderRadius:9, background:'#fff', fontSize:13, cursor:'pointer' }}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

/* ── Statut badge helper ──────────────────────────────────────────────────── */
const statutBadge = (s) => ({
  en_attente: { t:'En attente', bg:'#fef9c3', c:'#b45309' },
  confirme:   { t:'Confirmé ✓', bg:'#dcfce7', c:'#16a34a' },
  refuse:     { t:'Refusé',     bg:'#fee2e2', c:'#dc2626' },
}[s] || { t:s, bg:'#f3f4f6', c:'#888' });

/* ── DASHBOARD ──────────────────────────────────────────────────────────────── */
export function DashboardVeterinaire() {
  const { user } = useAuth();
  const [rdvList,  setRdvList]  = useState([]);
  const [notifs,   setNotifs]   = useState([]);
  const [selected, setSelected] = useState(null);

  const charger = () => {
    if (!user?.email) return;
    setRdvList(rdvStore.pourVet(user.email));
    setNotifs(notifStore.unread(user.email));
  };

  useEffect(() => {
    charger();
    const t = setInterval(charger, 2500); // polling 2.5s
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const accepter = (id) => { rdvStore.update(id, { statut:'confirme' }); charger(); };
  const refuser  = (id) => { rdvStore.update(id, { statut:'refuse'   }); charger(); };

  const urgences  = rdvList.filter(r => r.urgent && r.statut === 'en_attente');
  const attente   = rdvList.filter(r => !r.urgent && r.statut === 'en_attente');
  const confirmes = rdvList.filter(r => r.statut === 'confirme');

  return (
    <div>
      <PageHeader title={`Bonjour Dr. ${user?.nom?.split(' ')[0]} 👨‍⚕️`} subtitle="Tableau de bord vétérinaire" />

      {/* Notifications */}
      {notifs.length > 0 && (
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <p style={{ margin:0, fontWeight:700, color:'#2563eb' }}>🔔 {notifs.length} nouvelle(s) notification(s)</p>
            <button onClick={() => { notifStore.markAllRead(user.email); setNotifs([]); }}
              style={{ fontSize:12, color:'#2563eb', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
              Tout marquer lu
            </button>
          </div>
          {notifs.slice(0,3).map(n => (
            <div key={n.id} style={{ background:'#fff', borderRadius:8, padding:'8px 12px', marginBottom:5, fontSize:13, display:'flex', gap:8, alignItems:'flex-start' }}>
              <span>{n.type==='urgence'?'🚨':n.type==='rdv'?'📅':'✉️'}</span>
              <div>
                <p style={{ margin:0, fontWeight:600 }}>{n.titre}</p>
                <p style={{ margin:0, color:'#888', fontSize:12 }}>{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Total reçus"  value={rdvList.length}   sub="Demandes"     icon="📋" color="#3b82f6" />
        <StatCard label="Urgences"     value={urgences.length}  sub="À traiter"    icon="🚨" color="#dc2626" />
        <StatCard label="En attente"   value={attente.length}   sub="À confirmer"  icon="⏳" color="#b45309" />
        <StatCard label="Confirmés"    value={confirmes.length} sub="Acceptés"     icon="✅" color="#16a34a" />
      </div>

      {/* Urgences */}
      {urgences.map(u => (
        <div key={u.id} style={{ background:'#fff5f5', border:'1px solid #fecaca', borderRadius:12, padding:'14px 18px', marginBottom:12, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:22 }}>🚨</span>
          <div style={{ flex:1 }}>
            <p style={{ margin:0, fontWeight:700, color:'#dc2626', fontSize:14 }}>URGENT — {u.animal} · {u.agriNom}</p>
            <p style={{ margin:'2px 0 0', fontSize:13, color:'#888' }}>"{u.description.slice(0,70)}..."</p>
          </div>
          <button onClick={() => setSelected(u)}
            style={{ background:'#dc2626', color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            Traiter →
          </button>
        </div>
      ))}

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:20 }}>
        {/* Liste RDV */}
        <Card>
          <SectionTitle>Demandes reçues</SectionTitle>
          {rdvList.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>
              <p style={{ fontSize:36 }}>📅</p>
              <p style={{ fontWeight:600, color:'#555' }}>Aucune demande</p>
              <p style={{ fontSize:12 }}>Mise à jour automatique toutes les 3 secondes</p>
            </div>
          ) : rdvList.slice(0,6).map(r => {
            const bs = statutBadge(r.statut);
            return (
              <div key={r.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'11px 0', borderBottom:'1px solid #f9f9f9' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                    <p style={{ margin:0, fontWeight:600, fontSize:13 }}>🐾 {r.animal}</p>
                    {r.urgent && <span style={{ fontSize:10, padding:'1px 5px', borderRadius:8, background:'#fee2e2', color:'#dc2626', fontWeight:700 }}>URGENT</span>}
                    <span style={{ fontSize:11, padding:'2px 7px', borderRadius:10, background:bs.bg, color:bs.c, fontWeight:600 }}>{bs.t}</span>
                  </div>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>{r.agriNom} · 📅 {r.date}</p>
                </div>
                <div style={{ display:'flex', gap:5 }}>
                  <button onClick={() => setSelected(r)} style={{ fontSize:11, color:'#2563eb', background:'#eff6ff', border:'none', borderRadius:5, padding:'3px 8px', cursor:'pointer' }}>Voir</button>
                  {r.statut === 'en_attente' && (
                    <>
                      <button onClick={() => accepter(r.id)} style={{ fontSize:11, color:'#16a34a', background:'#f0fdf4', border:'none', borderRadius:5, padding:'3px 7px', cursor:'pointer' }}>✓</button>
                      <button onClick={() => refuser(r.id)}  style={{ fontSize:11, color:'#dc2626', background:'#fff5f5', border:'none', borderRadius:5, padding:'3px 7px', cursor:'pointer' }}>✗</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </Card>

        {/* Rapports */}
        <Card>
          <SectionTitle>Rapports récents</SectionTitle>
          {MOCK_RAPPORTS_VET.slice(0,4).map(r => (
            <div key={r.id} style={{ padding:'9px 0', borderBottom:'1px solid #f9f9f9' }}>
              <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:500 }}>🐾 {r.animal}</p>
              <p style={{ margin:'0 0 3px', fontSize:12, color:'#888' }}>{r.ferme}</p>
              <Badge statut={r.statut} />
            </div>
          ))}
        </Card>
      </div>

      {selected && <ModalDetail rdv={selected} onClose={() => setSelected(null)} onAccepter={accepter} onRefuser={refuser} />}
    </div>
  );
}

/* ── CONSULTATIONS ─────────────────────────────────────────────────────────── */
export function Consultations() {
  const { user } = useAuth();
  const [rdvList, setRdvList] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const charger = () => setRdvList(rdvStore.pourVet(user?.email));
    charger();
    const t = setInterval(charger, 2500);
    return () => clearInterval(t);
  }, [user?.email]);

  const accepter = (id) => { rdvStore.update(id, { statut:'confirme' }); setRdvList(rdvStore.pourVet(user?.email)); };
  const refuser  = (id) => { rdvStore.update(id, { statut:'refuse'   }); setRdvList(rdvStore.pourVet(user?.email)); };

  return (
    <div>
      <PageHeader title="Consultations" subtitle={`${rdvList.length} demande(s) — mise à jour automatique`} />
      {rdvList.length === 0 ? (
        <Card>
          <div style={{ textAlign:'center', padding:48, color:'#aaa' }}>
            <p style={{ fontSize:40 }}>📅</p>
            <p style={{ fontWeight:600, color:'#555' }}>Aucune demande reçue</p>
            <p style={{ fontSize:13 }}>Lorsqu'un agriculteur envoie un rendez-vous, il apparaît ici automatiquement</p>
          </div>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {rdvList.map(r => {
            const bs = statutBadge(r.statut);
            return (
              <Card key={r.id}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ display:'flex', gap:7, alignItems:'center', marginBottom:6 }}>
                      <p style={{ margin:0, fontWeight:700, fontSize:15 }}>🐾 {r.animal}</p>
                      {r.urgent && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:15, background:'#fee2e2', color:'#dc2626', fontWeight:700 }}>🚨 URGENT</span>}
                      <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:bs.bg, color:bs.c, fontWeight:600 }}>{bs.t}</span>
                    </div>
                    <p style={{ margin:'0 0 2px', fontSize:13, color:'#555' }}>👤 {r.agriNom} · 📞 {r.agriTel||r.agriEmail}</p>
                    <p style={{ margin:'0 0 2px', fontSize:13, color:'#555' }}>📅 Souhaité le {r.date}</p>
                    <p style={{ margin:0, fontSize:13, color:'#888', fontStyle:'italic' }}>"{r.description.slice(0,80)}"</p>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, marginLeft:14 }}>
                    <button onClick={() => setSelected(r)} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid #e8e8e8', background:'#fff', fontSize:12, cursor:'pointer' }}>📋 Détails</button>
                    {r.statut === 'en_attente' && (
                      <>
                        <button onClick={() => accepter(r.id)} style={{ padding:'6px 12px', borderRadius:7, border:'none', background:'#16a34a', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>✓ Accepter</button>
                        <button onClick={() => refuser(r.id)}  style={{ padding:'6px 12px', borderRadius:7, border:'none', background:'#fee2e2', color:'#dc2626', fontSize:12, fontWeight:600, cursor:'pointer' }}>✗ Refuser</button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {selected && <ModalDetail rdv={selected} onClose={() => setSelected(null)} onAccepter={accepter} onRefuser={refuser} />}
    </div>
  );
}

export function RapportsMedicaux() {
  const [rapports, setRapports] = useState(MOCK_RAPPORTS_VET);
  const [showForm, setShowForm] = useState(false);
  const [nv, setNv] = useState({ animal:'', ferme:'', diag:'', trt:'', statut:'normal', date:new Date().toISOString().split('T')[0] });

  const ajouter = () => {
    if (!nv.animal || !nv.diag) return;
    setRapports(p => [...p, { ...nv, id:`#R${p.length+1}` }]);
    setShowForm(false);
    setNv({ animal:'', ferme:'', diag:'', trt:'', statut:'normal', date:new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <PageHeader title="Rapports Médicaux" action={<Btn onClick={() => setShowForm(p=>!p)}>+ Nouveau</Btn>} />
      {showForm && (
        <Card style={{ marginBottom:18 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[['Animal','animal'],['Élevage','ferme'],['Diagnostic','diag'],['Traitement','trt']].map(([l,k]) => (
              <div key={k}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#555', marginBottom:3, textTransform:'uppercase' }}>{l}</label>
                <input value={nv[k]} onChange={e => setNv(p=>({...p,[k]:e.target.value}))}
                  style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:7, padding:'7px 10px', fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#555', marginBottom:3, textTransform:'uppercase' }}>Statut</label>
              <select value={nv.statut} onChange={e => setNv(p=>({...p,statut:e.target.value}))}
                style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:7, padding:'7px 10px', fontSize:13, outline:'none' }}>
                {['normal','suivi','traitement','urgence'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:10 }}>
            <Btn onClick={ajouter}>Créer</Btn>
            <Btn variant="secondary" onClick={() => setShowForm(false)}>Annuler</Btn>
          </div>
        </Card>
      )}
      <Card>
        <Table
          headers={['Animal','Élevage','Diagnostic','Traitement','Date','Statut','Actions']}
          rows={rapports.map(r => (
            <tr key={r.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
              <td style={{ padding:'10px 0', fontWeight:600 }}>🐾 {r.animal}</td>
              <td style={{ padding:'10px 0', color:'#888', fontSize:12 }}>{r.ferme}</td>
              <td style={{ padding:'10px 0', fontSize:12 }}>{r.diag}</td>
              <td style={{ padding:'10px 0', fontSize:12, color:'#888' }}>{r.trt}</td>
              <td style={{ padding:'10px 0', color:'#888', fontSize:12 }}>{r.date}</td>
              <td style={{ padding:'10px 0' }}><Badge statut={r.statut} /></td>
              <td style={{ padding:'10px 0' }}>
                <button onClick={() => setRapports(p => p.filter(x => x.id !== r.id))} style={{ fontSize:12, color:'#ef4444', background:'none', border:'none', cursor:'pointer' }}>Suppr.</button>
              </td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}

export function HistoriqueVeterinaire() {
  return (
    <div>
      <PageHeader title="Historique" />
      <Card>
        <Table
          headers={['Animal','Élevage','Diagnostic','Date','Résultat']}
          rows={MOCK_RAPPORTS_VET.map(r => (
            <tr key={r.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
              <td style={{ padding:'10px 0', fontWeight:500 }}>🐾 {r.animal}</td>
              <td style={{ padding:'10px 0', color:'#888', fontSize:12 }}>{r.ferme}</td>
              <td style={{ padding:'10px 0', fontSize:12 }}>{r.diag}</td>
              <td style={{ padding:'10px 0', color:'#888', fontSize:12 }}>{r.date}</td>
              <td style={{ padding:'10px 0' }}><Badge statut="normal" /></td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}