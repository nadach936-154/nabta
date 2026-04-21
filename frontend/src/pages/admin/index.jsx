// src/pages/admin/index.jsx
// ✅ BUG 8 corrigé : utilise usersStore.getAll() au lieu de MOCK_USERS
// Les nouveaux inscrits apparaissent immédiatement
import { useState, useEffect } from 'react';
import { StatCard, Badge, Card, SectionTitle, Table, PageHeader, Btn } from '../../components/UI';
import { MOCK_PRODUITS, MOCK_COMMANDES, MOCK_LIVRAISONS } from '../../data/mockData';
import { usersStore } from '../../context/AuthContext';
import { commandeStore, produitsStore } from '../../store/notifications';

const ROLE_COLOR = { admin:'#dc2626', agriculteur:'#16a34a', fournisseur:'#b45309', veterinaire:'#2563eb', transporteur:'#7c3aed' };
const ROLE_ICON  = { admin:'⚙️', agriculteur:'👨‍🌾', fournisseur:'🏪', veterinaire:'🐄', transporteur:'🚚' };

/* ═══════════════ DASHBOARD ═══════════════════════════════════════════════ */
export function DashboardAdmin() {
  const [allUsers, setAllUsers] = useState([]);
  const [allProduits, setAllProduits] = useState([]);
  const [allCommandes, setAllCommandes] = useState([]);

  useEffect(() => {
    // ✅ Charger depuis usersStore (inclut les nouveaux inscrits)
    setAllUsers(usersStore.getAll());
    setAllProduits(produitsStore.getAll());
    setAllCommandes(commandeStore.getAll());

    const t = setInterval(() => {
      setAllUsers(usersStore.getAll());
      setAllProduits(produitsStore.getAll());
      setAllCommandes(commandeStore.getAll());
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader title="Administration NABTA ⚙️" subtitle="Supervision globale de la plateforme" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        <StatCard label="Utilisateurs"  value={allUsers.length}                             icon="👥" color="#3b82f6" />
        <StatCard label="Produits"      value={allProduits.length}                          icon="📦" color="#b45309" />
        <StatCard label="Commandes"     value={allCommandes.length}                         icon="🛒" color="#f97316" />
        <StatCard label="Vétérinaires"  value={allUsers.filter(u=>u.role==='veterinaire').length} icon="🐄" color="#2563eb" />
        <StatCard label="Inactifs"      value={allUsers.filter(u=>!u.actif).length}         icon="🚫" color="#dc2626" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:20, marginBottom:20 }}>
        {/* Répartition rôles */}
        <Card>
          <SectionTitle>Répartition par Rôle</SectionTitle>
          {['agriculteur','fournisseur','veterinaire','transporteur','admin'].map(role => {
            const count = allUsers.filter(u=>u.role===role).length;
            const pct   = allUsers.length ? Math.round((count / allUsers.length) * 100) : 0;
            const color = ROLE_COLOR[role] || '#888';
            return (
              <div key={role} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:13 }}>
                  <span style={{ textTransform:'capitalize', fontWeight:500 }}>{ROLE_ICON[role]} {role}</span>
                  <span style={{ color:'#888' }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height:7, background:'#f0f0f0', borderRadius:4 }}>
                  <div style={{ height:'100%', borderRadius:4, background:color, width:`${pct}%`, transition:'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Derniers inscrits */}
        <Card>
          <SectionTitle>Derniers inscrits</SectionTitle>
          <Table
            headers={['Nom','Email','Rôle','Date']}
            rows={allUsers.slice().reverse().slice(0,6).map((u,i) => (
              <tr key={i} style={{ borderBottom:'1px solid #f9f9f9' }}>
                <td style={{ padding:'10px 0', fontWeight:500 }}>{u.nom}</td>
                <td style={{ padding:'10px 0', color:'#888', fontSize:12 }}>{u.email}</td>
                <td style={{ padding:'10px 0' }}>
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:600, background:(ROLE_COLOR[u.role]||'#888')+'18', color:ROLE_COLOR[u.role]||'#888' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding:'10px 0', color:'#aaa', fontSize:11 }}>
                  {u.dateCreation ? new Date(u.dateCreation).toLocaleDateString('fr-FR') : '—'}
                </td>
              </tr>
            ))}
          />
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════ UTILISATEURS ════════════════════════════════════════════ */
export function Utilisateurs() {
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState('tous');

  useEffect(() => {
    // ✅ Charger usersStore complet
    const charger = () => setUsers(usersStore.getAll());
    charger();
    const t = setInterval(charger, 3000);
    return () => clearInterval(t);
  }, []);

  const filtres = users.filter(u => {
    const okRole   = filtre === 'tous' || u.role === filtre;
    const term     = search.toLowerCase();
    const okSearch = !search || (u.nom||'').toLowerCase().includes(term) || (u.email||'').toLowerCase().includes(term);
    return okRole && okSearch;
  });

  const toggleActif = (email) => {
    usersStore.updateUser(email, { actif: !users.find(u=>u.email===email)?.actif });
    setUsers(usersStore.getAll());
  };

  return (
    <div>
      <PageHeader title="Gestion des Utilisateurs" subtitle={`${users.length} utilisateurs au total`} />

      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #e8e8e8', borderRadius:9, padding:'8px 14px', flex:1, minWidth:200 }}>
          <span>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom ou email..."
            style={{ border:'none', outline:'none', fontSize:14, width:'100%', fontFamily:'inherit' }} />
        </div>
        {['tous','agriculteur','fournisseur','veterinaire','transporteur','admin'].map(r => (
          <button key={r} onClick={() => setFiltre(r)}
            style={{ padding:'7px 14px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:'inherit', border:filtre===r?'none':'1px solid #e8e8e8', background:filtre===r?'#1a3a2a':'#fff', color:filtre===r?'#fff':'#555', fontWeight:filtre===r?600:400 }}>
            {ROLE_ICON[r]||'👥'} {r==='tous'?'Tous':r}
          </button>
        ))}
        <span style={{ fontSize:13, color:'#888', marginLeft:'auto' }}>{filtres.length} résultat(s)</span>
      </div>

      <Card>
        <Table
          headers={['Utilisateur','Email','Rôle','Téléphone','Adresse','Statut','Actions']}
          rows={filtres.map((u, i) => (
            <tr key={i} style={{ borderBottom:'1px solid #f9f9f9' }}>
              <td style={{ padding:'11px 0', fontWeight:600 }}>{u.nom}</td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{u.email}</td>
              <td style={{ padding:'11px 0' }}>
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:600, background:(ROLE_COLOR[u.role]||'#888')+'18', color:ROLE_COLOR[u.role]||'#888', textTransform:'capitalize' }}>
                  {ROLE_ICON[u.role]} {u.role}
                </span>
              </td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{u.telephone || '—'}</td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{u.adresse || '—'}</td>
              <td style={{ padding:'11px 0' }}>
                <Badge statut={u.actif!==false?'stock':'rupture'} />
              </td>
              <td style={{ padding:'11px 0' }}>
                <button onClick={() => toggleActif(u.email)}
                  style={{ fontSize:12, padding:'4px 10px', borderRadius:6, border:'none', background:u.actif!==false?'#fee2e2':'#dcfce7', color:u.actif!==false?'#dc2626':'#16a34a', cursor:'pointer', fontWeight:600 }}>
                  {u.actif!==false ? 'Désactiver' : 'Activer'}
                </button>
              </td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}

/* ═══════════════ PRODUITS ════════════════════════════════════════════════ */
export function ProduitsAdmin() {
  const [produits, setProduits] = useState([]);
  useEffect(() => {
    const c = () => setProduits(produitsStore.getAll());
    c();
    const t = setInterval(c, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader title="Gestion des Produits" subtitle={`${produits.length} produits sur la Marketplace`} />
      <Card>
        <Table
          headers={['Produit','Catégorie','Prix','Vendeur','Rôle','Statut','Action']}
          rows={produits.map((p, i) => (
            <tr key={i} style={{ borderBottom:'1px solid #f9f9f9' }}>
              <td style={{ padding:'11px 0', fontWeight:600 }}>{p.nom}</td>
              <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{p.cat}</td>
              <td style={{ padding:'11px 0', fontWeight:700, color:'#b45309' }}>{p.prix} DT</td>
              <td style={{ padding:'11px 0', fontSize:12 }}>{p.vendeurNom}</td>
              <td style={{ padding:'11px 0' }}>
                <span style={{ fontSize:11, padding:'2px 7px', borderRadius:8, background:(ROLE_COLOR[p.role]||'#888')+'18', color:ROLE_COLOR[p.role]||'#888', fontWeight:600 }}>{p.role}</span>
              </td>
              <td style={{ padding:'11px 0' }}><Badge statut={p.statut} /></td>
              <td style={{ padding:'11px 0' }}>
                <button onClick={() => { produitsStore.remove(p.id); setProduits(produitsStore.getAll()); }}
                  style={{ fontSize:12, color:'#ef4444', background:'none', border:'none', cursor:'pointer' }}>Retirer</button>
              </td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}

/* ═══════════════ STATISTIQUES ════════════════════════════════════════════ */
export function Statistiques() {
  const [allUsers, setAllUsers]       = useState([]);
  const [allCommandes, setAllCommandes] = useState([]);
  const [allProduits, setAllProduits] = useState([]);

  useEffect(() => {
    setAllUsers(usersStore.getAll());
    setAllCommandes(commandeStore.getAll());
    setAllProduits(produitsStore.getAll());
  }, []);

  const revenu = allCommandes.reduce((s, c) => s + (c.total||0), 0);

  return (
    <div>
      <PageHeader title="Statistiques" subtitle="Vue d'ensemble des performances" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        <StatCard label="Utilisateurs"  value={allUsers.length}      icon="👥" color="#3b82f6" />
        <StatCard label="Produits"      value={allProduits.length}   icon="📦" color="#b45309" />
        <StatCard label="Commandes"     value={allCommandes.length}  icon="🛒" color="#f97316" />
        <StatCard label="Revenu total"  value={`${revenu.toLocaleString()} DT`} icon="💰" color="#16a34a" />
      </div>
      <Card>
        <SectionTitle>Utilisateurs par rôle</SectionTitle>
        {['agriculteur','fournisseur','veterinaire','transporteur','admin'].map(role => {
          const count = allUsers.filter(u=>u.role===role).length;
          const pct   = allUsers.length ? Math.round((count/allUsers.length)*100) : 0;
          return (
            <div key={role} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13 }}>
                <span>{ROLE_ICON[role]} <strong>{role}</strong></span>
                <span style={{ color:'#888' }}>{count} utilisateurs ({pct}%)</span>
              </div>
              <div style={{ height:8, background:'#f0f0f0', borderRadius:4 }}>
                <div style={{ height:'100%', borderRadius:4, background:ROLE_COLOR[role]||'#888', width:`${pct}%`, transition:'width 0.5s' }} />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}