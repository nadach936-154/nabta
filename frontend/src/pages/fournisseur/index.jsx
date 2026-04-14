// ═══════════════════════════════════════════════════════════════════
// FICHIER 1 : src/pages/fournisseur/index.jsx
// ═══════════════════════════════════════════════════════════════════

// src/pages/fournisseur/index.jsx
import { useState, useEffect } from 'react';
import { StatCard, Card, SectionTitle, Table, Badge, PageHeader, Btn } from '../../components/UI';
import { commandeStore } from '../../store/notifications';
import { useAuth } from '../../context/AuthContext';

export function DashboardFournisseur() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const load = () => setCommandes(commandeStore.pourVendeur(user?.email));
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [user?.email]);

  const enAttente  = commandes.filter(c => c.statut === 'en_attente');
  const traitement = commandes.filter(c => c.statut === 'traitement');

  const avancer = (id, s) => { commandeStore.update(id, { statut:s }); setCommandes(commandeStore.pourVendeur(user?.email)); };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 3px', color:'#111' }}>Bonjour, {user?.nom?.split(' ')[0]} 🏪</h2>
          <p style={{ color:'#888', margin:0, fontSize:14 }}>Vue d'ensemble de votre activité</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Commandes reçues" value={commandes.length}   sub="Total"       icon="🛒" color="#b45309" />
        <StatCard label="En attente"        value={enAttente.length}  sub="À traiter"   icon="⏳" color="#f97316" />
        <StatCard label="En traitement"     value={traitement.length} sub="En cours"    icon="📦" color="#3b82f6" />
        <StatCard label="Livrées"           value={commandes.filter(c=>c.statut==='livree').length} sub="Terminées" icon="✅" color="#16a34a" />
      </div>

      {/* Nouvelles commandes */}
      {enAttente.length > 0 && (
        <div style={{ background:'#fefce8', border:'1px solid #fde68a', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
          <p style={{ margin:'0 0 10px', fontWeight:700, color:'#b45309', fontSize:14 }}>
            🛒 {enAttente.length} nouvelle(s) commande(s) à traiter
          </p>
          {enAttente.map(c => (
            <div key={c.id} style={{ background:'#fff', borderRadius:9, padding:'10px 14px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
              <div>
                <p style={{ margin:0, fontWeight:600 }}>{c.produitNom}</p>
                <p style={{ margin:0, color:'#888' }}>👤 {c.acheteurNom} · {c.qte} unité(s) · 📍 {c.adresse}</p>
              </div>
              <div style={{ display:'flex', gap:7, alignItems:'center' }}>
                <strong style={{ color:'#16a34a' }}>{c.total} DT</strong>
                <button onClick={() => avancer(c.id, 'traitement')} style={{ background:'#b45309', color:'#fff', border:'none', borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:600, cursor:'pointer' }}>Traiter →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card>
        <SectionTitle>Toutes les commandes</SectionTitle>
        {commandes.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>
            <p style={{ fontSize:36 }}>🛒</p>
            <p style={{ fontWeight:600, color:'#555' }}>Aucune commande</p>
            <p style={{ fontSize:12 }}>Vos commandes apparaîtront ici en temps réel</p>
          </div>
        ) : (
          <Table
            headers={['Produit','Acheteur','Qté','Total','Date','Statut','Action']}
            rows={commandes.map(c => {
              const ns = { en_attente:'traitement', traitement:'expediee', expediee:'livree' }[c.statut];
              const bl = { en_attente:'→ Traiter', traitement:'→ Expédier', expediee:'→ Livré' }[c.statut];
              return (
                <tr key={c.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
                  <td style={{ padding:'10px 0', fontWeight:500 }}>{c.produitNom}</td>
                  <td style={{ padding:'10px 0', color:'#888', fontSize:12 }}>{c.acheteurNom}</td>
                  <td style={{ padding:'10px 0' }}>{c.qte}</td>
                  <td style={{ padding:'10px 0', fontWeight:700, color:'#16a34a' }}>{c.total} DT</td>
                  <td style={{ padding:'10px 0', color:'#aaa', fontSize:12 }}>{c.at?.split('T')[0]}</td>
                  <td style={{ padding:'10px 0' }}><Badge statut={c.statut} /></td>
                  <td style={{ padding:'10px 0' }}>
                    {ns && <Btn size="sm" onClick={() => avancer(c.id, ns)}>{bl}</Btn>}
                  </td>
                </tr>
              );
            })}
          />
        )}
      </Card>
    </div>
  );
}

export function StockFournisseur() {
  const { user } = useAuth();
  const [produits] = useState(
    [
      { nom:'Engrais Bio Premium',   cat:'Engrais',    prix:450,  qte:150, statut:'stock'   },
      { nom:'Semences de Blé',        cat:'Semences',   prix:320,  qte:45,  statut:'bas'     },
      { nom:'Pesticide Naturel',       cat:'Protection', prix:280,  qte:0,   statut:'rupture' },
      { nom:"Système d'Irrigation",  cat:'Équipement', prix:1200, qte:85,  statut:'stock'   },
    ]
  );

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

// Marketplace est importé depuis son propre fichier dans App.js
export { default as MesProduitsOuMarketplace } from './Marketplace';