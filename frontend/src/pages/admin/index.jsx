// src/pages/admin/index.jsx
import { useState } from 'react';
import { StatCard, Badge, Card, SectionTitle, Table, PageHeader, Btn } from '../../components/UI';
import { MOCK_USERS, MOCK_PRODUITS, MOCK_COMMANDES, MOCK_LIVRAISONS } from '../../data/mockData';

const ROLE_COLOR = { admin:'#dc2626', agriculteur:'#16a34a', fournisseur:'#b45309', veterinaire:'#2563eb', transporteur:'#7c3aed' };

/* ═══════════════ DASHBOARD ═══════════════ */
export function DashboardAdmin() {
  return (
    <div>
      <PageHeader title="Administration NABTA ⚙️" subtitle="Supervision globale de la plateforme" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        <StatCard label="Utilisateurs"  value={MOCK_USERS.length}                                     color="#3b82f6" />
        <StatCard label="Produits"      value={MOCK_PRODUITS.length}                                   color="#b45309" />
        <StatCard label="Commandes"     value={MOCK_COMMANDES.length}                                  color="#f97316" />
        <StatCard label="Livraisons"    value={MOCK_LIVRAISONS.length}                                 color="#7c3aed" />
        <StatCard label="Inactifs"      value={MOCK_USERS.filter(u=>!u.actif).length}                  color="#dc2626" />
      </div>

      {/* Répartition rôles */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:20, marginBottom:20 }}>
        <Card>
          <SectionTitle>Répartition par Rôle</SectionTitle>
          {['agriculteur','fournisseur','veterinaire','transporteur','admin'].map(role => {
            const count = MOCK_USERS.filter(u=>u.role===role).length;
            const pct = Math.round((count / MOCK_USERS.length) * 100);
            const color = ROLE_COLOR[role] || '#888';
            return (
              <div key={role} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:13 }}>
                  <span style={{ textTransform:'capitalize', fontWeight:500 }}>{role}</span>
                  <span style={{ color:'#888' }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height:7, background:'#f0f0f0', borderRadius:4 }}>
                  <div style={{ height:'100%', borderRadius:4, background:color, width:`${pct}%`, transition:'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <SectionTitle>Activité Récente</SectionTitle>
          {[
            { msg:'Nouvelle inscription : Ahmed Bennani (Agriculteur)', time:'Il y a 2h',  icon:'👤', color:'#16a34a' },
            { msg:'Commande #C005 passée — Pesticide Naturel',          time:'Il y a 3h',  icon:'🛒', color:'#f97316' },
            { msg:'Rapport vétérinaire créé — Fièvre aphteuse',         time:'Il y a 5h',  icon:'📋', color:'#2563eb' },
            { msg:'Livraison #L003 terminée — Bizerte → Béja',          time:'Hier',       icon:'✅', color:'#16a34a' },
            { msg:'Compte Sara Belhadj désactivé par admin',            time:'Hier',       icon:'🔒', color:'#dc2626' },
          ].map((a, i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:'1px solid #f9f9f9' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:a.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontSize:13, fontWeight:500 }}>{a.msg}</p>
                <p style={{ margin:'2px 0 0', fontSize:11, color:'#aaa' }}>{a.time}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════ UTILISATEURS ═══════════════ */
export function Utilisateurs() {
  const [users, setUsers]   = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState('');

  const toggle = (id) => setUsers(p => p.map(u => u.id===id ? {...u,actif:!u.actif} : u));
  const filtres = users.filter(u =>
    (u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filtre || u.role === filtre)
  );

  return (
    <div>
      <PageHeader title="Gestion des Utilisateurs" subtitle="Gérez tous les comptes de la plateforme" />
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
          <p style={{ margin:0, fontWeight:600, fontSize:14 }}>{filtres.length} utilisateur(s)</p>
          <div style={{ display:'flex', gap:10 }}>
            <input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ border:'1px solid #e8e8e8', borderRadius:8, padding:'7px 12px', fontSize:13, outline:'none', width:220 }} />
            <select value={filtre} onChange={e=>setFiltre(e.target.value)}
              style={{ border:'1px solid #e8e8e8', borderRadius:8, padding:'7px 12px', fontSize:13, outline:'none' }}>
              <option value="">Tous les rôles</option>
              {['agriculteur','fournisseur','veterinaire','transporteur','admin'].map(r=>(
                <option key={r} value={r} style={{ textTransform:'capitalize' }}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <Table
          headers={['Utilisateur','Email','Rôle','Adresse','Statut','Actions']}
          rows={filtres.map(u => {
            const rc = ROLE_COLOR[u.role] || '#888';
            return (
              <tr key={u.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
                <td style={{ padding:'11px 0' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:rc+'18', color:rc, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, flexShrink:0 }}>
                      {u.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <span style={{ fontWeight:500, fontSize:13 }}>{u.nom}</span>
                  </div>
                </td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{u.email}</td>
                <td style={{ padding:'11px 0' }}>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600, background:rc+'18', color:rc, textTransform:'capitalize' }}>{u.role}</span>
                </td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{u.adresse}</td>
                <td style={{ padding:'11px 0' }}><Badge statut={u.actif ? 'actif' : 'inactif'} /></td>
                <td style={{ padding:'11px 0' }}>
                  {u.role !== 'admin' && (
                    <Btn size="sm" variant={u.actif ? 'danger' : 'secondary'} onClick={() => toggle(u.id)}>
                      {u.actif ? 'Désactiver' : 'Activer'}
                    </Btn>
                  )}
                </td>
              </tr>
            );
          })}
        />
      </Card>
    </div>
  );
}

/* ═══════════════ PRODUITS ADMIN ═══════════════ */
export function ProduitsAdmin() {
  return (
    <div>
      <PageHeader title="Tous les Produits" subtitle="Supervision du catalogue complet" />
      <Card>
        <Table
          headers={['ID','Nom','Catégorie','Prix (DT)','Quantité','Fournisseur','Statut']}
          rows={MOCK_PRODUITS.map(p => (
            <tr key={p.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
              <td style={{ padding:'11px 0', color:'#aaa', fontSize:12 }}>#{p.id}</td>
              <td style={{ padding:'11px 0', fontWeight:600 }}>{p.nom}</td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{p.cat}</td>
              <td style={{ padding:'11px 0', fontWeight:700, color:'#16a34a' }}>{p.prix} DT</td>
              <td style={{ padding:'11px 0' }}>{p.qte}</td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{p.fournisseur}</td>
              <td style={{ padding:'11px 0' }}><Badge statut={p.statut} /></td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}

/* ═══════════════ STATISTIQUES ═══════════════ */
export function Statistiques() {
  const totalRevenu = MOCK_COMMANDES.reduce((s,c) => s + c.total, 0);
  const cmdParStatut = {
    attente:    MOCK_COMMANDES.filter(c=>c.statut==='attente').length,
    traitement: MOCK_COMMANDES.filter(c=>c.statut==='traitement').length,
    expediee:   MOCK_COMMANDES.filter(c=>c.statut==='expediee').length,
    livree:     MOCK_COMMANDES.filter(c=>c.statut==='livree').length,
  };

  const barData = [
    { label:'Jan', val:42, color:'#16a34a' },
    { label:'Fév', val:68, color:'#16a34a' },
    { label:'Mar', val:55, color:'#16a34a' },
    { label:'Avr', val:91, color:'#22c55e' },
    { label:'Mai', val:73, color:'#16a34a' },
    { label:'Jun', val:84, color:'#16a34a' },
  ];
  const maxVal = Math.max(...barData.map(d => d.val));

  return (
    <div>
      <PageHeader title="Statistiques & Analytiques" subtitle="Vue d'ensemble des performances de la plateforme" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Revenu Total"   value={totalRevenu.toLocaleString()+' DT'} sub="Toutes commandes"  color="#16a34a" />
        <StatCard label="Taux de livraison" value="89%"                              sub="+5% ce mois"       color="#2563eb" />
        <StatCard label="Satisf. clients"  value="4.8/5"                             sub="342 avis"          color="#f59e0b" />
        <StatCard label="Croissance"       value="+22%"                              sub="vs mois dernier"   color="#16a34a" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:20 }}>
        {/* Bar chart */}
        <Card>
          <SectionTitle>Commandes par Mois</SectionTitle>
          <div style={{ display:'flex', alignItems:'flex-end', gap:12, height:160, padding:'0 8px' }}>
            {barData.map(d => (
              <div key={d.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:11, fontWeight:600, color:'#555' }}>{d.val}</span>
                <div style={{ width:'100%', background:d.color, borderRadius:'4px 4px 0 0', height:Math.round((d.val/maxVal)*130), transition:'height 0.5s', minHeight:8 }} />
                <span style={{ fontSize:12, color:'#888' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pie-like */}
        <Card>
          <SectionTitle>Statut Commandes</SectionTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
            {[
              { label:'En attente',   val:cmdParStatut.attente,    color:'#f97316', pct: Math.round(cmdParStatut.attente/MOCK_COMMANDES.length*100)    },
              { label:'En traitement',val:cmdParStatut.traitement, color:'#3b82f6', pct: Math.round(cmdParStatut.traitement/MOCK_COMMANDES.length*100) },
              { label:'Expédiées',    val:cmdParStatut.expediee,   color:'#a855f7', pct: Math.round(cmdParStatut.expediee/MOCK_COMMANDES.length*100)   },
              { label:'Livrées',      val:cmdParStatut.livree,     color:'#16a34a', pct: Math.round(cmdParStatut.livree/MOCK_COMMANDES.length*100)     },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:3 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:10, height:10, borderRadius:2, background:s.color, display:'inline-block' }} />
                    {s.label}
                  </span>
                  <span style={{ color:'#888', fontWeight:600 }}>{s.val} ({s.pct}%)</span>
                </div>
                <div style={{ height:6, background:'#f0f0f0', borderRadius:3 }}>
                  <div style={{ height:'100%', borderRadius:3, background:s.color, width:`${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top products */}
      <Card>
        <SectionTitle>Top Produits</SectionTitle>
        <Table
          headers={['Produit','Catégorie','Prix','Stock','Performance']}
          rows={MOCK_PRODUITS.map(p => (
            <tr key={p.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
              <td style={{ padding:'11px 0', fontWeight:500 }}>{p.nom}</td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{p.cat}</td>
              <td style={{ padding:'11px 0', fontWeight:700, color:'#16a34a' }}>{p.prix} DT</td>
              <td style={{ padding:'11px 0' }}><Badge statut={p.statut} /></td>
              <td style={{ padding:'11px 0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:80, height:6, background:'#f0f0f0', borderRadius:3 }}>
                    <div style={{ height:'100%', borderRadius:3, background:'#16a34a', width:`${Math.min(100, Math.round(p.qte/2))}%` }} />
                  </div>
                  <span style={{ fontSize:12, color:'#888' }}>{Math.min(100, Math.round(p.qte/2))}%</span>
                </div>
              </td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}