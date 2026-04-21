// src/pages/agriculteur/DashboardAgriculteur.jsx
// ✅ BUG 2 corrigé : mes commandes depuis commandeStore.pourAcheteur (pas de fausses données)
// ✅ BUG 7 corrigé : météo RÉELLE depuis wttr.in (gratuit, sans clé API)
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commandeStore } from '../../store/notifications';

const CULTURES = [
  { nom:'Blé Dur',    surface:'12 ha', statut:'croissance', recolte:'Avr 2026', sante:85 },
  { nom:'Tomates',    surface:'5 ha',  statut:'floraison',  recolte:'Mar 2026', sante:92 },
  { nom:'Oliviers',   surface:'20 ha', statut:'repos',      recolte:'Oct 2026', sante:78 },
  { nom:'Pommes de Terre',surface:'8 ha',statut:'plantation',recolte:'Mai 2026',sante:90 },
];

const STATUT_CFG = {
  croissance: { label:'En croissance', bg:'#dcfce7', color:'#16a34a' },
  floraison:  { label:'Floraison',     bg:'#dbeafe', color:'#2563eb' },
  repos:      { label:'Repos',         bg:'#f3f4f6', color:'#6b7280' },
  plantation: { label:'Plantation',    bg:'#fef9c3', color:'#b45309' },
  recolte:    { label:'Récolte',       bg:'#ede9fe', color:'#7c3aed' },
};

// ── Météo réelle depuis wttr.in (gratuit, sans clé API) ──────────────────────
async function fetchMeteo(ville = 'Tunis') {
  try {
    const resp = await fetch(
      `https://wttr.in/${encodeURIComponent(ville)}?format=j1`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    const cur  = data?.current_condition?.[0];
    if (!cur) return null;
    return {
      ville,
      temp:       parseInt(cur.temp_C),
      ressenti:   parseInt(cur.FeelsLikeC),
      desc:       cur.weatherDesc?.[0]?.value || 'N/A',
      humidite:   cur.humidity,
      vent:       cur.windspeedKmph,
    };
  } catch {
    return null;
  }
}

const VILLES_TN = ['Tunis','Sfax','Sousse','Nabeul','Kairouan','Gafsa','Tozeur','Bizerte','Béja','Monastir'];

export default function DashboardAgriculteur() {
  const { user } = useAuth();
  const [mesCommandes, setMesCommandes] = useState([]);
  const [meteo,        setMeteo]        = useState(null);
  const [meteoVille,   setMeteoVille]   = useState('Tunis');
  const [meteoLoading, setMeteoLoading] = useState(false);

  // ── Charger MES commandes (ce que j'ai acheté) ────────────────────────────
  useEffect(() => {
    const charger = () => setMesCommandes(commandeStore.pourAcheteur(user?.email));
    charger();
    const t = setInterval(charger, 3000);
    return () => clearInterval(t);
  }, [user?.email]);

  // ── Charger la météo réelle ───────────────────────────────────────────────
  useEffect(() => {
    const chargerMeteo = async () => {
      setMeteoLoading(true);
      const data = await fetchMeteo(meteoVille);
      setMeteo(data);
      setMeteoLoading(false);
    };
    chargerMeteo();
  }, [meteoVille]);

  const enCours = mesCommandes.filter(c => c.statut !== 'livree');

  const weatherIcon = (desc = '') => {
    const d = desc.toLowerCase();
    if (d.includes('sunny') || d.includes('clear'))  return '☀️';
    if (d.includes('cloud'))                          return '⛅';
    if (d.includes('rain') || d.includes('drizzle'))  return '🌧';
    if (d.includes('storm') || d.includes('thunder')) return '⛈';
    if (d.includes('snow'))                           return '❄️';
    if (d.includes('fog') || d.includes('mist'))      return '🌫';
    return '🌤';
  };

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 4px', color:'#111' }}>
        Bonjour, {user?.nom?.split(' ')[0]} 👋
      </h2>
      <p style={{ color:'#888', margin:'0 0 24px', fontSize:14 }}>Gérez vos cultures et activités agricoles</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Cultures Actives', val:CULTURES.length,      sub:'45 ha total',            icon:'🌾', color:'#22c55e' },
          { label:'Prochaine Récolte',val:'18j',                sub:'Tomates',                icon:'📅', color:'#3b82f6' },
          { label:'Mes Commandes',    val:enCours.length,       sub:`${mesCommandes.length} total`, icon:'📦', color:'#f97316' },
          { label:'Mes Produits',     val:'—',                  sub:'Voir Marketplace',       icon:'🛒', color:'#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, padding:'18px 20px', display:'flex', justifyContent:'space-between' }}>
            <div>
              <p style={{ margin:'0 0 6px', fontSize:12, color:'#888' }}>{s.label}</p>
              <p style={{ margin:'0 0 4px', fontSize:26, fontWeight:700, color:'#111' }}>{typeof s.val === 'number' ? s.val : s.val}</p>
              <p style={{ margin:0, fontSize:12, color:s.color }}>{s.sub}</p>
            </div>
            <span style={{ fontSize:22, opacity:0.7 }}>{s.icon}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:20 }}>
        {/* Mes cultures */}
        <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, padding:'18px 20px' }}>
          <p style={{ margin:'0 0 14px', fontWeight:600, fontSize:14 }}>🌾 Mes Cultures</p>
          {CULTURES.map(c => {
            const cfg = STATUT_CFG[c.statut] || { label:c.statut, bg:'#f3f4f6', color:'#888' };
            return (
              <div key={c.nom} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f9f9f9' }}>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:14, fontWeight:600 }}>{c.nom}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>{c.surface} · Récolte : {c.recolte}</p>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <div style={{ width:60, height:6, background:'#f0f0f0', borderRadius:3 }}>
                    <div style={{ height:'100%', borderRadius:3, background:'#16a34a', width:`${c.sante}%` }} />
                  </div>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600, background:cfg.bg, color:cfg.color }}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ BUG 7 : Météo RÉELLE ─────────────────────────────────────── */}
        <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, padding:'18px 20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <p style={{ margin:0, fontWeight:600, fontSize:14 }}>🌤 Météo en direct</p>
          </div>
          {/* Sélecteur ville */}
          <select value={meteoVille} onChange={e=>setMeteoVille(e.target.value)}
            style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'7px 10px', fontSize:13, outline:'none', marginBottom:12, fontFamily:'inherit' }}>
            {VILLES_TN.map(v => <option key={v}>{v}</option>)}
          </select>
          {meteoLoading ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:'#aaa' }}>
              <div style={{ width:28, height:28, border:'3px solid #e8e8e8', borderTopColor:'#16a34a', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 8px' }} />
              <p style={{ fontSize:12, margin:0 }}>Chargement météo réelle...</p>
            </div>
          ) : meteo ? (
            <div>
              <div style={{ textAlign:'center', padding:'10px 0' }}>
                <span style={{ fontSize:44 }}>{weatherIcon(meteo.desc)}</span>
                <p style={{ margin:'4px 0 2px', fontSize:32, fontWeight:800, color:'#111' }}>{meteo.temp}°C</p>
                <p style={{ margin:'0 0 4px', fontSize:13, color:'#555' }}>{meteo.desc}</p>
                <p style={{ margin:0, fontSize:12, color:'#888' }}>Ressenti : {meteo.ressenti}°C</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
                {[
                  ['💧', 'Humidité', `${meteo.humidite}%`],
                  ['💨', 'Vent', `${meteo.vent} km/h`],
                ].map(([icon, label, val]) => (
                  <div key={label} style={{ background:'#f7f8fa', borderRadius:8, padding:'8px 10px', textAlign:'center' }}>
                    <p style={{ margin:'0 0 2px', fontSize:16 }}>{icon}</p>
                    <p style={{ margin:'0 0 2px', fontSize:11, color:'#888' }}>{label}</p>
                    <p style={{ margin:0, fontSize:14, fontWeight:700 }}>{val}</p>
                  </div>
                ))}
              </div>
              <p style={{ margin:'10px 0 0', fontSize:10, color:'#bbb', textAlign:'center' }}>
                ⚡ Données réelles • {meteo.ville}
              </p>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'20px 0', color:'#aaa' }}>
              <p style={{ fontSize:32 }}>🌤</p>
              <p style={{ fontSize:13, margin:0 }}>Données météo indisponibles</p>
              <p style={{ fontSize:11, margin:'4px 0 0' }}>Vérifiez votre connexion internet</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ BUG 2 : Mes vraies commandes ─────────────────────────────────── */}
      <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, padding:'18px 20px' }}>
        <p style={{ margin:'0 0 14px', fontWeight:600, fontSize:14 }}>📦 Mes Commandes</p>
        {mesCommandes.length === 0 ? (
          <div style={{ textAlign:'center', padding:'24px 0', color:'#aaa' }}>
            <p style={{ fontSize:32, margin:'0 0 8px' }}>📦</p>
            <p style={{ fontSize:14, fontWeight:600, color:'#555', margin:'0 0 4px' }}>Aucune commande</p>
            <p style={{ fontSize:12 }}>Vos achats sur la Marketplace apparaîtront ici</p>
          </div>
        ) : mesCommandes.map(c => (
          <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f9f9f9' }}>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:600 }}>{c.produitNom}</p>
              <p style={{ margin:0, fontSize:12, color:'#888' }}>
                🏪 {c.vendeurNom} · {c.qte} unité(s) · 📍 {c.adresse || '—'}
              </p>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ fontWeight:700, color:'#16a34a', fontSize:14 }}>{(c.total||0).toLocaleString()} DT</span>
              <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:600,
                background:{en_attente:'#fef9c3',traitement:'#dbeafe',expediee:'#ede9fe',livree:'#dcfce7'}[c.statut]||'#f3f4f6',
                color:{en_attente:'#b45309',traitement:'#2563eb',expediee:'#7c3aed',livree:'#16a34a'}[c.statut]||'#888'
              }}>
                {c.statut}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}