// src/pages/agriculteur/index.jsx — version complète avec toutes les corrections
import { useState } from 'react';
import { StatCard, Badge, Card, SectionTitle, Table, PageHeader, Btn } from '../../components/UI';
import { MOCK_CULTURES, MOCK_ACTIVITES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

// ═══════════════ METEO (déplacée dans le Dashboard) ══════════════════════════
function MeteoWidget() {
  const [ville, setVille] = useState('Tunis');
  const VILLES = ['Tunis','Sfax','Sousse','Nabeul','Bizerte','Gafsa','Kairouan','Béja','Jendouba'];
  const METEO = {
    Tunis:    { temp:22, icon:'☀️',  desc:'Ensoleillé',           hum:55, pluie:'0mm',  vent:15 },
    Sfax:     { temp:25, icon:'🌤',  desc:'Partiellement nuageux', hum:48, pluie:'0mm',  vent:18 },
    Sousse:   { temp:24, icon:'⛅',  desc:'Nuageux',               hum:62, pluie:'2mm',  vent:12 },
    Nabeul:   { temp:21, icon:'🌧',  desc:'Pluie légère',          hum:75, pluie:'8mm',  vent:20 },
    Bizerte:  { temp:20, icon:'🌦',  desc:'Averses',               hum:70, pluie:'5mm',  vent:22 },
    Gafsa:    { temp:28, icon:'☀️',  desc:'Chaud et sec',          hum:30, pluie:'0mm',  vent:10 },
    Kairouan: { temp:26, icon:'☀️',  desc:'Ensoleillé',            hum:40, pluie:'0mm',  vent:14 },
    Béja:     { temp:19, icon:'🌧',  desc:'Pluies',                hum:80, pluie:'12mm', vent:25 },
    Jendouba: { temp:23, icon:'⛅',  desc:'Variable',              hum:60, pluie:'3mm',  vent:16 },
  };
  const m = METEO[ville];

  const conseils = [
    m.pluie !== '0mm' ? '💧 Pluie prévue — réduisez l\'irrigation' : '🚿 Pas de pluie — irrigation recommandée',
    m.temp > 30 ? '🌡 Chaleur forte — protégez vos cultures sensibles' : m.temp < 10 ? '🧊 Froid — couvrez les semis' : '✅ Température favorable à la végétation',
    m.vent > 20 ? '💨 Vent fort — évitez les traitements phytosanitaires' : '🌿 Vent modéré — conditions favorables aux traitements',
  ];

  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <p style={{ margin:0, fontWeight:700, fontSize:14 }}>🌤 Météo Agricole</p>
        <select value={ville} onChange={e => setVille(e.target.value)}
          style={{ border:'1px solid #e8e8e8', borderRadius:8, padding:'5px 10px', fontSize:13, outline:'none', fontFamily:'inherit' }}>
          {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div style={{ background:'#f0fdf4', borderRadius:10, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:38, marginBottom:4 }}>{m.icon}</div>
          <p style={{ margin:0, fontSize:28, fontWeight:800, color:'#111' }}>{m.temp}°C</p>
          <p style={{ margin:'3px 0 0', fontSize:12, color:'#888' }}>{m.desc}</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
          {[['💧','Hum.',`${m.hum}%`],['🌧','Pluie',m.pluie],['💨','Vent',`${m.vent}km/h`],['📍','Ville',ville]].map(([icon,lbl,val]) => (
            <div key={lbl} style={{ background:'#f7f8fa', borderRadius:7, padding:'8px', textAlign:'center' }}>
              <p style={{ margin:'0 0 2px', fontSize:11, color:'#888' }}>{icon} {lbl}</p>
              <p style={{ margin:0, fontSize:12, fontWeight:700 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        {conseils.map((c,i) => (
          <div key={i} style={{ background:'#f7f8fa', borderRadius:7, padding:'7px 10px', fontSize:12, color:'#555' }}>{c}</div>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════ DASHBOARD ══════════════════════════════════════════════════
export function DashboardAgriculteur() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title={`Bonjour, ${user?.nom?.split(' ')[0]} 👋`} subtitle="Vue d'ensemble de votre activité agricole" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Cultures Actives"   value="5"     sub="45 ha total"   icon="🌾" color="#16a34a" />
        <StatCard label="Prochaine Récolte"  value="18j"   sub="Tomates"       icon="📅" color="#2563eb" />
        <StatCard label="Commandes en cours" value="3"     sub="En livraison"  icon="📦" color="#b45309" />
        <StatCard label="Revenu (DT)"        value="12.4K" sub="+18% ce mois"  icon="💰" color="#16a34a" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:20, marginBottom:20 }}>
        <Card>
          <SectionTitle>Mes Cultures</SectionTitle>
          <Table
            headers={['Culture','Surface','Statut','Santé']}
            rows={MOCK_CULTURES.slice(0,4).map(c => (
              <tr key={c.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
                <td style={{ padding:'9px 0', fontWeight:500 }}>{c.nom}</td>
                <td style={{ padding:'9px 0', color:'#888', fontSize:12 }}>{c.surface}</td>
                <td style={{ padding:'9px 0' }}><Badge statut={c.statut} /></td>
                <td style={{ padding:'9px 0' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:45, height:5, background:'#f0f0f0', borderRadius:3 }}>
                      <div style={{ height:'100%', borderRadius:3, background:c.sante>85?'#16a34a':c.sante>70?'#f59e0b':'#ef4444', width:`${c.sante}%` }} />
                    </div>
                    <span style={{ fontSize:11, color:'#888' }}>{c.sante}%</span>
                  </div>
                </td>
              </tr>
            ))}
          />
        </Card>
        <Card>
          <SectionTitle>Activités Récentes</SectionTitle>
          {MOCK_ACTIVITES.slice(0,4).map((a,i) => (
            <div key={i} style={{ display:'flex', gap:8, padding:'8px 0', borderBottom:'1px solid #f9f9f9' }}>
              <div style={{ width:28, height:28, borderRadius:7, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{a.icon}</div>
              <div>
                <p style={{ margin:0, fontSize:12, fontWeight:500 }}>{a.action}</p>
                <p style={{ margin:'1px 0 0', fontSize:11, color:'#888' }}>{a.culture} · {a.heure}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Météo dans le Dashboard */}
      <MeteoWidget />
    </div>
  );
}

// ═══════════════ MES CULTURES (avec modifier) ════════════════════════════════
export function MesCultures() {
  const [cultures, setCultures] = useState(MOCK_CULTURES);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form, setForm] = useState({ nom:'', surface:'', statut:'plantation', recolte:'', parcelle:'', sante:100 });

  const ouvrir = (culture = null) => {
    if (culture) {
      setEditId(culture.id);
      setForm({ nom:culture.nom, surface:culture.surface, statut:culture.statut, recolte:culture.recolte, parcelle:culture.parcelle, sante:culture.sante });
    } else {
      setEditId(null);
      setForm({ nom:'', surface:'', statut:'plantation', recolte:'', parcelle:'', sante:100 });
    }
    setShowForm(true);
  };

  const sauvegarder = () => {
    if (!form.nom || !form.surface) return;
    if (editId) {
      setCultures(p => p.map(c => c.id === editId ? { ...c, ...form } : c));
    } else {
      setCultures(p => [...p, { ...form, id: p.length + 1 }]);
    }
    setShowForm(false);
    setEditId(null);
  };

  return (
    <div>
      <PageHeader title="Mes Cultures" subtitle="Gérez et suivez vos cultures agricoles"
        action={<Btn onClick={() => ouvrir()}>+ Nouvelle Culture</Btn>} />

      {showForm && (
        <Card style={{ marginBottom:20 }}>
          <p style={{ margin:'0 0 14px', fontWeight:600 }}>{editId ? '✏️ Modifier la culture' : 'Ajouter une culture'}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[['Nom','nom'],['Surface (ha)','surface'],['Parcelle','parcelle'],['Récolte prévue','recolte']].map(([l,k]) => (
              <div key={k}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:4, textTransform:'uppercase' }}>{l}</label>
                <input value={form[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))}
                  style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:7, padding:'8px 10px', fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:4, textTransform:'uppercase' }}>Statut</label>
              <select value={form.statut} onChange={e => setForm(p=>({...p,statut:e.target.value}))}
                style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:7, padding:'8px 10px', fontSize:13, outline:'none' }}>
                {['plantation','croissance','floraison','recolte','repos'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:4, textTransform:'uppercase' }}>Santé (%)</label>
              <input type="number" min={0} max={100} value={form.sante} onChange={e => setForm(p=>({...p,sante:Number(e.target.value)}))}
                style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:7, padding:'8px 10px', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <Btn onClick={sauvegarder}>{editId ? 'Enregistrer' : 'Ajouter'}</Btn>
            <Btn variant="secondary" onClick={() => { setShowForm(false); setEditId(null); }}>Annuler</Btn>
          </div>
        </Card>
      )}

      <Card>
        <Table
          headers={['Parcelle','Culture','Surface','Statut','Récolte','Santé','Actions']}
          rows={cultures.length === 0
            ? [<tr key="e"><td colSpan={7} style={{ textAlign:'center', padding:32, color:'#aaa' }}>Aucune culture. Ajoutez-en une !</td></tr>]
            : cultures.map(c => (
              <tr key={c.id} style={{ borderBottom:'1px solid #f9f9f9' }}>
                <td style={{ padding:'11px 0', color:'#aaa', fontSize:11 }}>{c.parcelle}</td>
                <td style={{ padding:'11px 0', fontWeight:600 }}>{c.nom}</td>
                <td style={{ padding:'11px 0', color:'#888' }}>{c.surface}</td>
                <td style={{ padding:'11px 0' }}><Badge statut={c.statut} /></td>
                <td style={{ padding:'11px 0', color:'#888', fontSize:12 }}>{c.recolte}</td>
                <td style={{ padding:'11px 0' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:40, height:5, background:'#f0f0f0', borderRadius:3 }}>
                      <div style={{ height:'100%', borderRadius:3, background:c.sante>85?'#16a34a':c.sante>70?'#f59e0b':'#ef4444', width:`${c.sante}%` }} />
                    </div>
                    <span style={{ fontSize:11 }}>{c.sante}%</span>
                  </div>
                </td>
                <td style={{ padding:'11px 0' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {/* ✅ Bouton Modifier */}
                    <button onClick={() => ouvrir(c)}
                      style={{ fontSize:12, color:'#2563eb', background:'#eff6ff', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontFamily:'inherit' }}>
                      ✏️ Modifier
                    </button>
                    <button onClick={() => setCultures(p => p.filter(x => x.id !== c.id))}
                      style={{ fontSize:12, color:'#ef4444', background:'#fff5f5', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontFamily:'inherit' }}>
                      🗑 Suppr.
                    </button>
                  </div>
                </td>
              </tr>
            ))
          }
        />
      </Card>
    </div>
  );
}

// ═══════════════ LIVRAISON ═══════════════════════════════════════════════════
export function LivraisonAgriculteur() {
  const [commandes, setCommandes] = useState([
    { id:'#C001', produit:'Engrais Bio Premium',   fournisseur:'Fatima Zahra', qte:2,  total:900,  adresse:'Tunis, Ariana', date:'2026-04-01', statut:'en_cours'   },
    { id:'#C002', produit:'Semences de Blé',         fournisseur:'Fatima Zahra', qte:5,  total:1600, adresse:'Tunis, Ariana', date:'2026-03-30', statut:'livre'      },
    { id:'#C003', produit:'Pesticide Naturel',        fournisseur:'Sara Belhadj', qte:1,  total:280,  adresse:'Tunis, Ariana', date:'2026-04-02', statut:'en_attente' },
  ]);

  return (
    <div>
      <PageHeader title="Mes Commandes" subtitle="Suivez vos achats et livraisons" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="En cours"   value={commandes.filter(l=>l.statut==='en_cours').length}   icon="🚚" color="#2563eb" />
        <StatCard label="En attente" value={commandes.filter(l=>l.statut==='en_attente').length} icon="⏳" color="#b45309" />
        <StatCard label="Livrées"    value={commandes.filter(l=>l.statut==='livre').length}      icon="✅" color="#16a34a" />
      </div>
      <Card>
        <SectionTitle>Mes commandes</SectionTitle>
        {commandes.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px', color:'#aaa' }}>
            <p style={{ fontSize:36, marginBottom:10 }}>📦</p>
            <p>Aucune commande. Achetez des produits depuis la Marketplace !</p>
          </div>
        ) : commandes.map(c => (
          <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #f9f9f9' }}>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📦</div>
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:600 }}>{c.produit}</p>
                <p style={{ margin:'2px 0 0', fontSize:12, color:'#888' }}>🏪 {c.fournisseur} · Qté: {c.qte} · 📍 {c.adresse}</p>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ margin:'0 0 4px', fontSize:14, fontWeight:800, color:'#16a34a' }}>{c.total.toLocaleString()} DT</p>
              <Badge statut={c.statut} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export { default as MesProduitsAgriculteur } from './Marketplace';
export { default as Reseau }                 from './Contacts';