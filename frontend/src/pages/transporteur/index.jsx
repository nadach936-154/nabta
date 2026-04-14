// src/pages/transporteur/index.jsx — version complète corrigée
import { useState } from 'react';
import { StatCard, Badge, Card, SectionTitle, Table, PageHeader, Btn } from '../../components/UI';
import { MOCK_LIVRAISONS, MOCK_DEMANDES_TRANSPORT, MOCK_HISTORIQUE_TRANSPORT } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const NEXT_STATUT = { en_attente:'confirme', confirme:'en_cours', en_cours:'livre' };
const NEXT_LABEL  = { confirme:'✓ Confirmer', en_cours:'▶ Démarrer', livre:'✅ Marquer livré' };

// ═══════════════ DASHBOARD ═══════════════════════════════════════════════════
export function DashboardTransporteur() {
  const { user } = useAuth();
  const [livraisons,  setLivraisons]  = useState(MOCK_LIVRAISONS);
  const [historique,  setHistorique]  = useState(MOCK_HISTORIQUE_TRANSPORT);

  const avancer = (id) => {
    setLivraisons(prev => {
      const updated = prev.map(l => {
        if (l.id !== id) return l;
        const next = NEXT_STATUT[l.statut];
        if (!next) return l;
        const newL = { ...l, statut: next };
        // Si livré → ajouter à l'historique
        if (next === 'livre') {
          setHistorique(h => [...h, { ...newL, note: (4 + Math.random()).toFixed(1) }]);
          return null; // sera filtré
        }
        return newL;
      }).filter(Boolean);
      return updated;
    });
  };

  return (
    <div>
      <PageHeader title={`Bonjour, ${user?.nom?.split(' ')[0]} 🚚`} subtitle="Vue d'ensemble de vos livraisons" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Actives"    value={livraisons.length}                                    sub="En cours"  icon="📦" color="#3b82f6" />
        <StatCard label="En cours"   value={livraisons.filter(l=>l.statut==='en_cours').length}   sub="En route"  icon="🚚" color="#f97316" />
        <StatCard label="En attente" value={livraisons.filter(l=>l.statut==='en_attente').length} sub="À démarrer"icon="⏳" color="#b45309" />
        <StatCard label="Livrées"    value={historique.length}                                    sub="Terminées" icon="✅" color="#16a34a" />
      </div>
      <Card>
        <SectionTitle>Livraisons actives</SectionTitle>
        <Table
          headers={['ID','Produit','De','Vers','Total','Statut','Action']}
          rows={livraisons.length === 0
            ? [<tr key="e"><td colSpan={7} style={{ textAlign:'center', padding:28, color:'#aaa' }}>Toutes les livraisons sont terminées ✅</td></tr>]
            : livraisons.map(l => (
              <tr key={l.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
                <td style={{ padding:'11px 0', color:'#aaa', fontSize:12 }}>{l.id}</td>
                <td style={{ padding:'11px 0', fontWeight:500 }}>{l.produit}</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>📍{l.from}</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>🏁{l.to}</td>
                <td style={{ padding:'11px 0', fontWeight:700 }}>{l.total.toLocaleString()} DT</td>
                <td style={{ padding:'11px 0' }}><Badge statut={l.statut} /></td>
                <td style={{ padding:'11px 0' }}>
                  {NEXT_STATUT[l.statut] && (
                    <Btn size="sm" onClick={() => avancer(l.id)}>
                      {NEXT_LABEL[NEXT_STATUT[l.statut]]}
                    </Btn>
                  )}
                </td>
              </tr>
            ))
          }
        />
      </Card>
    </div>
  );
}

// ═══════════════ LIVRAISONS ACTIVES ══════════════════════════════════════════
export function LivraisonsTransporteur() {
  const [livraisons, setLivraisons] = useState(MOCK_LIVRAISONS);
  const [historique, setHistorique] = useState(MOCK_HISTORIQUE_TRANSPORT);

  const avancer = (id) => {
    setLivraisons(prev => {
      const updated = prev.map(l => {
        if (l.id !== id) return l;
        const next = NEXT_STATUT[l.statut];
        if (!next) return l;
        const newL = { ...l, statut: next };
        if (next === 'livre') {
          setHistorique(h => [...h, { ...newL, note:(4+Math.random()).toFixed(1) }]);
          return null;
        }
        return newL;
      }).filter(Boolean);
      return updated;
    });
  };

  return (
    <div>
      <PageHeader title="Livraisons Actives" subtitle="Gérez vos livraisons en cours et planifiées" />
      {livraisons.length === 0 ? (
        <Card>
          <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>
            <p style={{ fontSize:36, marginBottom:10 }}>🎉</p>
            <p style={{ fontWeight:600, color:'#555' }}>Toutes les livraisons sont terminées !</p>
            <p style={{ fontSize:13 }}>Vérifiez les nouvelles demandes dans l'onglet "Demandes"</p>
          </div>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {livraisons.map(l => (
            <Card key={l.id}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                    <p style={{ margin:0, fontWeight:700, fontSize:15 }}>{l.produit}</p>
                    <Badge statut={l.statut} />
                  </div>
                  <p style={{ margin:'0 0 3px', fontSize:13, color:'#555' }}>👤 {l.client}</p>
                  <p style={{ margin:'0 0 3px', fontSize:13, color:'#555' }}>📍 {l.from} → {l.to} · {l.distance}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>📅 {l.date}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ margin:'0 0 10px', fontSize:18, fontWeight:800, color:'#111' }}>{l.total.toLocaleString()} DT</p>
                  {NEXT_STATUT[l.statut] && (
                    <Btn onClick={() => avancer(l.id)}>
                      {NEXT_LABEL[NEXT_STATUT[l.statut]]}
                    </Btn>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════ DEMANDES (accepter → va dans livraisons en_attente) ═════════
export function DemandesTransporteur() {
  const [demandes, setDemandes]   = useState(MOCK_DEMANDES_TRANSPORT);
  const [livraisons,setLivraisons]= useState([]);
  const [notif, setNotif]         = useState('');

  const accepter = (demande) => {
    // ✅ Ajouter dans livraisons en mode "en_attente" (PAS confirmé)
    const newLivraison = {
      id:       demande.id.replace('#D','#L-NEW-'),
      produit:  demande.produit,
      from:     demande.from,
      to:       demande.to,
      client:   demande.client,
      statut:   'en_attente',   // ← en_attente, pas confirmé
      total:    demande.prix,
      date:     new Date().toISOString().split('T')[0],
      distance: demande.distance,
    };
    setLivraisons(prev => [...prev, newLivraison]);
    setDemandes(prev => prev.filter(d => d.id !== demande.id));
    setNotif(`✅ Demande acceptée ! "${demande.produit}" ajoutée à vos livraisons en attente.`);
    setTimeout(() => setNotif(''), 4000);
  };

  const refuser = (id) => {
    setDemandes(prev => prev.filter(d => d.id !== id));
    setNotif('❌ Demande refusée.');
    setTimeout(() => setNotif(''), 3000);
  };

  return (
    <div>
      <PageHeader title="Nouvelles Demandes" subtitle="Acceptez de nouvelles missions de livraison" />

      {notif && (
        <div style={{ background:notif.startsWith('✅')?'#f0fdf4':'#fff5f5', border:`1px solid ${notif.startsWith('✅')?'#bbf7d0':'#fecaca'}`, borderRadius:10, padding:'11px 16px', marginBottom:18, fontSize:14, color:notif.startsWith('✅')?'#16a34a':'#dc2626', fontWeight:500 }}>
          {notif}
        </div>
      )}

      {/* Livraisons acceptées (en attente) */}
      {livraisons.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <p style={{ fontWeight:700, fontSize:14, color:'#b45309', marginBottom:10 }}>⏳ En attente de démarrage ({livraisons.length})</p>
          {livraisons.map(l => (
            <div key={l.id} style={{ background:'#fefce8', border:'1px solid #fde68a', borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:13 }}>{l.produit}</p>
                <p style={{ margin:0, fontSize:12, color:'#888' }}>📍 {l.from} → {l.to} · {l.distance}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ margin:'0 0 4px', fontWeight:700, color:'#16a34a' }}>{l.total} DT</p>
                <Badge statut="en_attente" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Demandes disponibles */}
      {demandes.length === 0 ? (
        <Card>
          <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>
            <p style={{ fontSize:36, marginBottom:10 }}>📭</p>
            <p style={{ fontWeight:600, color:'#555' }}>Aucune nouvelle demande</p>
            <p style={{ fontSize:13 }}>Revenez plus tard pour de nouvelles missions</p>
          </div>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {demandes.map(d => (
            <Card key={d.id}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ margin:'0 0 6px', fontWeight:700, fontSize:15 }}>{d.produit}</p>
                  <p style={{ margin:'0 0 3px', fontSize:13, color:'#555' }}>📍 {d.from} → {d.to} · {d.distance}</p>
                  <p style={{ margin:'0 0 3px', fontSize:13, color:'#555' }}>👤 {d.client} · {d.telephone}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>📅 Départ prévu : {d.date}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ margin:'0 0 12px', fontSize:22, fontWeight:800, color:'#16a34a' }}>{d.prix} DT</p>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn size="sm" onClick={() => accepter(d)}>✓ Accepter</Btn>
                    <Btn size="sm" variant="danger" onClick={() => refuser(d.id)}>✗ Refuser</Btn>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════ HISTORIQUE (livraisons terminées) ════════════════════════════
export function HistoriqueTransporteur() {
  const [historique] = useState(MOCK_HISTORIQUE_TRANSPORT);

  return (
    <div>
      <PageHeader title="Historique des Livraisons" subtitle="Toutes vos livraisons terminées" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Total livrées" value={historique.length}                           sub="Depuis le début"    color="#16a34a" />
        <StatCard label="Revenu total"  value={historique.reduce((s,l)=>s+l.total,0).toLocaleString()+' DT'} sub="Brut" color="#2563eb" />
        <StatCard label="Note moyenne"  value={historique.length > 0 ? (historique.reduce((s,l)=>s+parseFloat(l.note||4.5),0)/historique.length).toFixed(1)+'/5' : '—'} sub="Satisfaction client" color="#f59e0b" />
      </div>
      {historique.length === 0 ? (
        <Card>
          <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>
            <p style={{ fontSize:36, marginBottom:10 }}>📋</p>
            <p>Aucune livraison terminée pour l'instant</p>
          </div>
        </Card>
      ) : (
        <Card>
          <Table
            headers={['ID','Produit','De','Vers','Client','Total','Date','Note']}
            rows={historique.map(l => (
              <tr key={l.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
                <td style={{ padding:'11px 0', color:'#aaa', fontSize:12 }}>{l.id}</td>
                <td style={{ padding:'11px 0', fontWeight:500 }}>{l.produit}</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{l.from}</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{l.to}</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{l.client}</td>
                <td style={{ padding:'11px 0', fontWeight:700, color:'#16a34a' }}>{l.total.toLocaleString()} DT</td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{l.date}</td>
                <td style={{ padding:'11px 0' }}>
                  <span style={{ fontSize:12, color:'#f59e0b', fontWeight:700 }}>⭐ {l.note}</span>
                </td>
              </tr>
            ))}
          />
        </Card>
      )}
    </div>
  );
}