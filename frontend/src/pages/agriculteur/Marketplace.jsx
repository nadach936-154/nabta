// src/pages/agriculteur/Marketplace.jsx
// ✅ CORRECTION : utilise produitsStore (partagé avec le fournisseur)
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { produitsStore, commandeStore } from '../../store/notifications';

const CATEGORIES = ['Toutes','Engrais','Semences','Protection','Équipement','Culture','Alimentation animale'];
const EMOJIS = { Engrais:'🌿', Semences:'🌱', Protection:'🧪', Équipement:'🚜', Culture:'🌾', 'Alimentation animale':'🐄' };

const Sbadge = ({ statut }) => {
  const c = {
    stock:   { t:'En stock',  bg:'#dcfce7', cl:'#16a34a' },
    bas:     { t:'Stock bas', bg:'#fef9c3', cl:'#b45309' },
    rupture: { t:'Rupture',   bg:'#fee2e2', cl:'#dc2626' },
  }[statut] || { t:statut, bg:'#f3f4f6', cl:'#888' };
  return <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:600, background:c.bg, color:c.cl }}>{c.t}</span>;
};

/* ── Modal Achat ─────────────────────────────────────────────────────────────*/
function ModalAchat({ produit, user, onClose, onOk }) {
  const [qte,     setQte]     = useState(1);
  const [adresse, setAdresse] = useState(user?.adresse || '');
  const [ok,      setOk]      = useState(false);
  const [envoi,   setEnvoi]   = useState(false);

  const confirmer = () => {
    if (!adresse.trim()) return alert('Adresse de livraison requise.');
    if (envoi) return;
    setEnvoi(true);
    commandeStore.passer({
      produitNom:    produit.nom,
      produitId:     produit.id,
      vendeurEmail:  produit.vendeurEmail,
      vendeurNom:    produit.vendeurNom,
      acheteurEmail: user?.email,
      acheteurNom:   user?.nom,
      qte,
      adresse,
      prixUnit: produit.prix,
      total:    produit.prix * qte,
    });
    onOk?.();
    setOk(true);
    setTimeout(() => { setOk(false); setEnvoi(false); onClose(); }, 2000);
  };

  if (!produit) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:420, width:'90%' }}>
        {ok ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48, marginBottom:10 }}>✅</div>
            <h3 style={{ color:'#16a34a', margin:0 }}>Commande envoyée !</h3>
            <p style={{ color:'#888', fontSize:13, marginTop:6 }}>Le vendeur a été notifié.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>{produit.nom}</h3>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ background:'#f7f8fa', borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:13 }}>
              <p style={{ margin:'0 0 3px' }}>🏪 Vendeur : <strong>{produit.vendeurNom}</strong></p>
              <p style={{ margin:'0 0 3px' }}>📦 Stock : <strong>{produit.qte} unités</strong></p>
              <p style={{ margin:0 }}>💰 Prix : <strong style={{ color:'#16a34a' }}>{produit.prix} DT/unité</strong></p>
            </div>
            <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase' }}>Quantité</p>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
              <button onClick={() => setQte(q => Math.max(1,q-1))} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #e8e8e8', background:'#f7f8fa', fontSize:18, cursor:'pointer' }}>−</button>
              <span style={{ fontSize:20, fontWeight:700, minWidth:30, textAlign:'center' }}>{qte}</span>
              <button onClick={() => setQte(q => Math.min(produit.qte,q+1))} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #e8e8e8', background:'#f7f8fa', fontSize:18, cursor:'pointer' }}>+</button>
            </div>
            <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase' }}>Adresse de livraison</p>
            <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Votre adresse..."
              style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'9px 12px', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:14 }} />
            <div style={{ background:'#f0fdf4', borderRadius:8, padding:'9px 14px', marginBottom:16, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:13 }}>Total :</span>
              <strong style={{ fontSize:16, color:'#16a34a' }}>{(produit.prix * qte).toLocaleString()} DT</strong>
            </div>
            <div style={{ display:'flex', gap:9 }}>
              <button onClick={confirmer} disabled={envoi || produit.statut==='rupture'}
                style={{ flex:1, background:produit.statut==='rupture'?'#d1d5db':'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:produit.statut==='rupture'?'not-allowed':'pointer' }}>
                {produit.statut==='rupture' ? 'Rupture' : envoi ? '⏳...' : '🛒 Confirmer'}
              </button>
              <button onClick={onClose} style={{ padding:'11px 14px', border:'1px solid #e8e8e8', borderRadius:9, background:'#fff', fontSize:13, cursor:'pointer' }}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Modal Publier ───────────────────────────────────────────────────────────*/
function ModalPublier({ user, onClose, onOk }) {
  const [form, setForm] = useState({ nom:'', cat:'Culture', prix:'', qte:'', desc:'' });
  const [ok,   setOk]   = useState(false);

  const publier = () => {
    if (!form.nom || !form.prix || !form.qte) return alert('Remplissez tous les champs *.');
    if (Number(form.prix) <= 0 || Number(form.qte) < 0) return alert('Prix et quantité doivent être positifs.');
    // ✅ Sauvegarde dans produitsStore partagé
    produitsStore.add({
      nom:          form.nom,
      cat:          form.cat,
      prix:         Number(form.prix),
      qte:          Number(form.qte),
      statut:       Number(form.qte) > 0 ? 'stock' : 'rupture',
      vendeurNom:   user?.nom,
      vendeurEmail: (user?.email || '').toLowerCase(),
      role:         'agriculteur',
      desc:         form.desc,
    });
    onOk?.();
    setOk(true);
    setTimeout(() => { setOk(false); onClose(); }, 2000);
  };

  const inp = { width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
  const lbl = { display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:4, textTransform:'uppercase' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:460, width:'90%' }}>
        {ok ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48, marginBottom:10 }}>✅</div>
            <h3 style={{ color:'#16a34a', margin:0 }}>Produit publié !</h3>
            <p style={{ color:'#888', fontSize:13, marginTop:6 }}>Visible sur la Marketplace pour tous.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>📢 Publier un produit</h3>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lbl}>Nom du produit *</label>
                <input style={inp} value={form.nom} onChange={e => setForm(f=>({...f,nom:e.target.value}))} placeholder="Tomates fraîches, Huile d'olive..." />
              </div>
              <div>
                <label style={lbl}>Catégorie</label>
                <select style={{ ...inp, cursor:'pointer' }} value={form.cat} onChange={e => setForm(f=>({...f,cat:e.target.value}))}>
                  {['Culture','Engrais','Semences','Protection','Équipement','Alimentation animale'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Prix (DT/unité) *</label>
                <input style={inp} type="number" min="0" value={form.prix} onChange={e => setForm(f=>({...f,prix:e.target.value}))} placeholder="0" />
              </div>
              <div>
                <label style={lbl}>Quantité disponible *</label>
                <input style={inp} type="number" min="0" value={form.qte} onChange={e => setForm(f=>({...f,qte:e.target.value}))} placeholder="0" />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lbl}>Description</label>
                <textarea style={{ ...inp, resize:'vertical' }} rows={3} value={form.desc} onChange={e => setForm(f=>({...f,desc:e.target.value}))} placeholder="Qualité, origine, conditions..." />
              </div>
            </div>
            <div style={{ display:'flex', gap:9, marginTop:16 }}>
              <button onClick={publier} style={{ flex:1, background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                📢 Publier
              </button>
              <button onClick={onClose} style={{ padding:'11px 14px', border:'1px solid #e8e8e8', borderRadius:9, background:'#fff', fontSize:13, cursor:'pointer' }}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page Marketplace Agriculteur ───────────────────────────────────────────*/
export default function MarketplaceAgriculteur() {
  const { user } = useAuth();
  // ✅ utilise produitsStore (partagé avec fournisseur)
  const [produits,  setProduits]  = useState([]);
  const [cat,       setCat]       = useState('Toutes');
  const [search,    setSearch]    = useState('');
  const [onglet,    setOnglet]    = useState('tous');
  const [achat,     setAchat]     = useState(null);
  const [showPubl,  setShowPubl]  = useState(false);
  const [notif,     setNotif]     = useState('');

  // ✅ Charger depuis le store partagé + polling 3s
  const reload = () => setProduits(produitsStore.getAll());
  useEffect(() => {
    reload();
    const t = setInterval(reload, 3000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtres = produits.filter(p => {
    const okCat    = cat === 'Toutes' || p.cat === cat;
    const okSearch = !search ||
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      (p.vendeurNom||'').toLowerCase().includes(search.toLowerCase());
    const myEmail  = (user?.email||'').toLowerCase();
    const okOnglet = onglet === 'tous' || (onglet === 'mes-produits' && (p.vendeurEmail||'').toLowerCase() === myEmail);
    return okCat && okSearch && okOnglet;
  });

  const retirer = (id) => {
    produitsStore.remove(id);
    reload();
    setNotif('🗑️ Produit retiré.');
    setTimeout(() => setNotif(''), 3000);
  };

  const isMine = (p) => (p.vendeurEmail||'').toLowerCase() === (user?.email||'').toLowerCase();

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 3px', color:'#111' }}>🛒 Marketplace</h2>
          <p style={{ color:'#888', margin:0, fontSize:14 }}>Achetez et vendez des produits agricoles</p>
        </div>
        <button onClick={() => setShowPubl(true)}
          style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:'9px 18px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          📢 Publier un produit
        </button>
      </div>

      {notif && (
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:14, color:'#16a34a', fontWeight:500 }}>
          {notif}
        </div>
      )}

      {/* Onglets */}
      <div style={{ display:'flex', gap:0, marginBottom:14, background:'#f7f8fa', borderRadius:9, padding:3, width:'fit-content' }}>
        {[['tous','🌍 Tous les produits'],['mes-produits','👨‍🌾 Mes publications']].map(([v,l]) => (
          <button key={v} onClick={() => setOnglet(v)}
            style={{ padding:'6px 16px', borderRadius:7, border:'none', fontSize:13, fontWeight:onglet===v?700:400, background:onglet===v?'#fff':'transparent', color:onglet===v?'#111':'#888', cursor:'pointer', fontFamily:'inherit', boxShadow:onglet===v?'0 1px 4px rgba(0,0,0,0.07)':'none' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #e8e8e8', borderRadius:9, padding:'8px 14px', marginBottom:12 }}>
        <span>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Produit ou vendeur..."
          style={{ border:'none', outline:'none', fontSize:14, width:'100%', fontFamily:'inherit' }} />
        {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:16 }}>×</button>}
        <span style={{ fontSize:12, color:'#888', whiteSpace:'nowrap' }}>{filtres.length} produit(s)</span>
      </div>

      {/* Filtres catégorie */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:18 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ padding:'5px 13px', borderRadius:18, fontSize:12, cursor:'pointer', fontFamily:'inherit', border:cat===c?'none':'1px solid #e8e8e8', background:cat===c?'#16a34a':'#fff', color:cat===c?'#fff':'#555', fontWeight:cat===c?600:400 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grille */}
      {filtres.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'#aaa' }}>
          <p style={{ fontSize:40 }}>{onglet==='mes-produits'?'📢':'🔍'}</p>
          <p style={{ fontWeight:600, color:'#555' }}>{onglet==='mes-produits' ? 'Aucune publication' : 'Aucun produit trouvé'}</p>
          <p style={{ fontSize:13 }}>{onglet==='mes-produits' ? 'Cliquez sur "Publier un produit"' : 'Essayez une autre catégorie'}</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:14 }}>
          {filtres.map(p => {
            const mine = isMine(p);
            return (
              <div key={p.id} style={{ background:'#fff', border:`1px solid ${mine?'#bbf7d0':'#e8e8e8'}`, borderRadius:13, overflow:'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ height:80, background:mine?'#f0fdf4':'#f7f8fa', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, position:'relative' }}>
                  {EMOJIS[p.cat]||'📦'}
                  {mine && <span style={{ position:'absolute', top:6, right:6, fontSize:10, padding:'2px 6px', borderRadius:8, background:'#16a34a', color:'#fff', fontWeight:700 }}>MON PRODUIT</span>}
                  {p.role==='fournisseur' && !mine && <span style={{ position:'absolute', top:6, right:6, fontSize:10, padding:'2px 6px', borderRadius:8, background:'#fefce8', color:'#b45309', fontWeight:700 }}>FOURNISSEUR</span>}
                </div>
                <div style={{ padding:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <p style={{ margin:0, fontWeight:700, fontSize:13, flex:1, marginRight:5 }}>{p.nom}</p>
                    <Sbadge statut={p.statut} />
                  </div>
                  <p style={{ margin:'0 0 2px', fontSize:12, color:'#888' }}>📦 {p.cat} · 🏪 {p.vendeurNom}</p>
                  {p.desc && <p style={{ margin:'0 0 6px', fontSize:11, color:'#aaa' }}>{p.desc.slice(0,50)}…</p>}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
                    <span style={{ fontSize:17, fontWeight:800, color:'#16a34a' }}>{p.prix} DT</span>
                    {mine ? (
                      <button onClick={() => retirer(p.id)}
                        style={{ padding:'5px 11px', borderRadius:7, border:'none', background:'#fee2e2', color:'#dc2626', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                        🗑 Retirer
                      </button>
                    ) : (
                      <button onClick={() => setAchat(p)} disabled={p.statut==='rupture'}
                        style={{ padding:'5px 13px', borderRadius:7, border:'none', background:p.statut==='rupture'?'#f3f4f6':'#16a34a', color:p.statut==='rupture'?'#aaa':'#fff', fontSize:12, fontWeight:600, cursor:p.statut==='rupture'?'not-allowed':'pointer' }}>
                        {p.statut==='rupture'?'Indispo':'Acheter'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {achat    && <ModalAchat    produit={achat} user={user} onClose={() => setAchat(null)} onOk={() => { setNotif(`✅ Commande de "${achat.nom}" envoyée !`); setTimeout(()=>setNotif(''),4000); }} />}
      {showPubl && <ModalPublier  user={user} onClose={() => setShowPubl(false)} onOk={() => { reload(); setNotif('✅ Produit publié ! Visible pour tous.'); setTimeout(()=>setNotif(''),4000); }} />}
    </div>
  );
}