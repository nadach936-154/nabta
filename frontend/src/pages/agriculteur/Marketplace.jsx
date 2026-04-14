// src/pages/agriculteur/Marketplace.jsx
// Agriculteur peut ACHETER et PUBLIER ses propres produits
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Toutes', 'Engrais', 'Semences', 'Protection', 'Équipement', 'Culture', 'Alimentation animale'];

// Produits initiaux (fournisseurs + quelques agriculteurs)
const PRODUITS_INIT = [
  { id:1, nom:'Engrais Bio Premium',   cat:'Engrais',    prix:450,  qte:150, statut:'stock',   vendeur:'Fatima Zahra',  type:'fournisseur', description:'Engrais complet NPK 15-15-15 certifié bio' },
  { id:2, nom:'Semences de Blé Dur',    cat:'Semences',   prix:320,  qte:45,  statut:'bas',     vendeur:'Fatima Zahra',  type:'fournisseur', description:'Variété Karim adaptée au climat tunisien' },
  { id:3, nom:'Pesticide Naturel',      cat:'Protection', prix:280,  qte:0,   statut:'rupture', vendeur:'Sara Belhadj',  type:'fournisseur', description:'Protection bio contre pucerons et acariens' },
  { id:4, nom:"Système d'Irrigation",  cat:'Équipement', prix:1200, qte:85,  statut:'stock',   vendeur:'Fatima Zahra',  type:'fournisseur', description:'Kit goutte-à-goutte complet 1 ha' },
  { id:5, nom:'Fertilisant Organique',  cat:'Engrais',    prix:380,  qte:120, statut:'stock',   vendeur:'Sara Belhadj',  type:'fournisseur', description:'Compost naturel enrichi en oligo-éléments' },
  { id:6, nom:'Maïs Grain — Récolte 2026', cat:'Culture', prix:12,  qte:500, statut:'stock',   vendeur:'Ahmed Bennani', type:'agriculteur', description:'Maïs grain sec, récolte fraîche avril 2026' },
  { id:7, nom:'Huile d\'olive extra',   cat:'Culture',    prix:18,   qte:200, statut:'stock',   vendeur:'Ahmed Bennani', type:'agriculteur', description:'Huile d\'olive extra vierge première pression' },
];

const StatutBadge = ({ statut }) => {
  const c = { stock:{ t:'En stock', bg:'#dcfce7', cl:'#16a34a' }, bas:{ t:'Stock bas', bg:'#fef9c3', cl:'#b45309' }, rupture:{ t:'Rupture', bg:'#fee2e2', cl:'#dc2626' } }[statut] || { t:statut, bg:'#f3f4f6', cl:'#888' };
  return <span style={{ fontSize:11, padding:'2px 8px', borderRadius:12, fontWeight:600, background:c.bg, color:c.cl }}>{c.t}</span>;
};

// ── Modal Achat ──────────────────────────────────────────────────────────────
function ModalAchat({ produit, onClose, onConfirmer }) {
  const [qte,     setQte]     = useState(1);
  const [adresse, setAdresse] = useState('');
  const [ok,      setOk]      = useState(false);

  if (!produit) return null;

  const confirmer = () => {
    if (!adresse.trim()) return alert('Saisissez une adresse de livraison.');
    onConfirmer({ produit, qte, adresse, total: produit.prix * qte });
    setOk(true);
    setTimeout(() => { setOk(false); onClose(); }, 2000);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:440, width:'90%' }}>
        {ok ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <h3 style={{ color:'#16a34a', margin:0 }}>Commande envoyée !</h3>
            <p style={{ color:'#888', fontSize:13, marginTop:6 }}>Le vendeur a été notifié.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ margin:0, fontSize:17, fontWeight:700 }}>{produit.nom}</h3>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ background:'#f7f8fa', borderRadius:10, padding:'12px 14px', marginBottom:16, fontSize:13 }}>
              <p style={{ margin:'0 0 3px' }}>🏪 Vendeur : <strong>{produit.vendeur}</strong></p>
              <p style={{ margin:'0 0 3px' }}>📦 Stock : <strong>{produit.qte} unités</strong></p>
              <p style={{ margin:0 }}>💰 Prix : <strong style={{ color:'#16a34a' }}>{produit.prix} DT / unité</strong></p>
            </div>
            {/* Quantité */}
            <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase' }}>Quantité</p>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
              <button onClick={() => setQte(q => Math.max(1, q-1))} style={{ width:34, height:34, borderRadius:'50%', border:'1px solid #e8e8e8', background:'#f7f8fa', fontSize:18, cursor:'pointer' }}>−</button>
              <span style={{ fontSize:20, fontWeight:700, minWidth:30, textAlign:'center' }}>{qte}</span>
              <button onClick={() => setQte(q => Math.min(produit.qte, q+1))} style={{ width:34, height:34, borderRadius:'50%', border:'1px solid #e8e8e8', background:'#f7f8fa', fontSize:18, cursor:'pointer' }}>+</button>
            </div>
            {/* Adresse */}
            <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase' }}>Adresse de livraison</p>
            <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Tunis, Ariana, Route de Bizerte..."
              style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'9px 12px', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:16 }} />
            {/* Total */}
            <div style={{ background:'#f0fdf4', borderRadius:8, padding:'10px 14px', marginBottom:18, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:13 }}>Total :</span>
              <strong style={{ fontSize:16, color:'#16a34a' }}>{(produit.prix * qte).toLocaleString()} DT</strong>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={confirmer} disabled={produit.statut==='rupture'}
                style={{ flex:1, background:produit.statut==='rupture'?'#d1d5db':'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:produit.statut==='rupture'?'not-allowed':'pointer' }}>
                {produit.statut==='rupture' ? 'Rupture de stock' : '🛒 Confirmer l\'achat'}
              </button>
              <button onClick={onClose} style={{ padding:'11px 16px', border:'1px solid #e8e8e8', borderRadius:9, background:'#fff', fontSize:13, cursor:'pointer' }}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Modal Publier produit ────────────────────────────────────────────────────
function ModalPublier({ onClose, onPublier, vendeur }) {
  const [form, setForm] = useState({ nom:'', cat:'Culture', prix:'', qte:'', description:'' });
  const [ok, setOk]     = useState(false);

  const publier = () => {
    if (!form.nom || !form.prix || !form.qte) return alert('Remplissez tous les champs obligatoires.');
    onPublier({ ...form, prix:Number(form.prix), qte:Number(form.qte), vendeur, type:'agriculteur', statut:'stock' });
    setOk(true);
    setTimeout(() => { setOk(false); onClose(); }, 2000);
  };

  const inp = { width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
  const lbl = { display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:4, textTransform:'uppercase' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:480, width:'90%' }}>
        {ok ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <h3 style={{ color:'#16a34a', margin:0 }}>Produit publié !</h3>
            <p style={{ color:'#888', fontSize:13, marginTop:6 }}>Votre produit est visible sur la Marketplace.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ margin:0, fontSize:17, fontWeight:700 }}>📢 Publier un produit</h3>
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
                  {['Culture','Engrais','Semences','Protection','Équipement','Alimentation animale'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Prix (DT / unité) *</label>
                <input style={inp} type="number" min="0" value={form.prix} onChange={e => setForm(f=>({...f,prix:e.target.value}))} placeholder="0" />
              </div>
              <div>
                <label style={lbl}>Quantité disponible *</label>
                <input style={inp} type="number" min="1" value={form.qte} onChange={e => setForm(f=>({...f,qte:e.target.value}))} placeholder="0" />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lbl}>Description</label>
                <textarea style={{ ...inp, resize:'vertical' }} rows={3} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Décrivez votre produit, son origine, sa qualité..." />
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:18 }}>
              <button onClick={publier}
                style={{ flex:1, background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:11, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                📢 Publier sur la Marketplace
              </button>
              <button onClick={onClose} style={{ padding:'11px 16px', border:'1px solid #e8e8e8', borderRadius:9, background:'#fff', fontSize:13, cursor:'pointer' }}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page principale Marketplace ──────────────────────────────────────────────
export default function Marketplace() {
  const { user } = useAuth();
  const [produits,   setProduits]   = useState(PRODUITS_INIT);
  const [categorie,  setCategorie]  = useState('Toutes');
  const [search,     setSearch]     = useState('');
  const [achatModal, setAchatModal] = useState(null);
  const [publierModal, setPublierModal] = useState(false);
  const [notif,      setNotif]      = useState('');
  const [onglet,     setOnglet]     = useState('tous'); // tous | mes-produits

  const filtres = produits.filter(p => {
    const matchCat    = categorie === 'Toutes' || p.cat === categorie;
    const matchSearch = !search || p.nom.toLowerCase().includes(search.toLowerCase()) || p.vendeur.toLowerCase().includes(search.toLowerCase());
    const matchOnglet = onglet === 'tous' || (onglet === 'mes-produits' && p.vendeur === user?.nom);
    return matchCat && matchSearch && matchOnglet;
  });

  const handleAcheter = ({ produit, qte, adresse, total }) => {
    setNotif(`✅ Commande de "${produit.nom}" (${qte} unité(s)) envoyée ! Total : ${total.toLocaleString()} DT`);
    setTimeout(() => setNotif(''), 5000);
  };

  const handlePublier = (nouveau) => {
    setProduits(p => [...p, { ...nouveau, id: p.length + 1 }]);
    setNotif('✅ Produit publié avec succès sur la Marketplace !');
    setTimeout(() => setNotif(''), 4000);
  };

  const supprimerMonProduit = (id) => {
    setProduits(p => p.filter(x => x.id !== id));
    setNotif('🗑️ Produit retiré de la Marketplace.');
    setTimeout(() => setNotif(''), 3000);
  };

  const EMOJIS_CAT = { Engrais:'🌿', Semences:'🌱', Protection:'🧪', Équipement:'🚜', Culture:'🌾', 'Alimentation animale':'🐄' };

  return (
    <div>
      {/* En-tête */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 4px', color:'#111' }}>🛒 Marketplace</h2>
          <p style={{ color:'#888', margin:0, fontSize:14 }}>Achetez et vendez des produits agricoles</p>
        </div>
        <button onClick={() => setPublierModal(true)}
          style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:'9px 18px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6 }}>
          📢 Publier un produit
        </button>
      </div>

      {/* Notification */}
      {notif && (
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'11px 16px', marginBottom:16, fontSize:14, color:'#16a34a', fontWeight:500 }}>
          {notif}
        </div>
      )}

      {/* Onglets */}
      <div style={{ display:'flex', gap:0, marginBottom:16, background:'#f7f8fa', borderRadius:10, padding:4, width:'fit-content' }}>
        {[['tous','🌍 Tous les produits'],['mes-produits','👨‍🌾 Mes publications']].map(([val, label]) => (
          <button key={val} onClick={() => setOnglet(val)}
            style={{ padding:'7px 18px', borderRadius:8, border:'none', fontSize:13, fontWeight:onglet===val?700:400, background:onglet===val?'#fff':'transparent', color:onglet===val?'#111':'#888', cursor:'pointer', fontFamily:'inherit', boxShadow:onglet===val?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Barre de recherche */}
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #e8e8e8', borderRadius:9, padding:'8px 14px', marginBottom:14 }}>
        <span>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit ou vendeur..."
          style={{ border:'none', outline:'none', fontSize:14, width:'100%', fontFamily:'inherit' }} />
        {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:16 }}>×</button>}
        <span style={{ fontSize:12, color:'#888', whiteSpace:'nowrap' }}>{filtres.length} produit(s)</span>
      </div>

      {/* Filtres catégorie */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategorie(cat)}
            style={{ padding:'6px 14px', borderRadius:20, fontSize:13, cursor:'pointer', fontFamily:'inherit', border:categorie===cat?'none':'1px solid #e8e8e8', background:categorie===cat?'#16a34a':'#fff', color:categorie===cat?'#fff':'#555', fontWeight:categorie===cat?600:400, transition:'all 0.12s' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      {filtres.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 24px', color:'#aaa' }}>
          <p style={{ fontSize:40, margin:'0 0 12px' }}>{onglet==='mes-produits'?'📢':'🔍'}</p>
          <p style={{ fontSize:15, fontWeight:600, color:'#555', margin:'0 0 4px' }}>
            {onglet==='mes-produits' ? 'Aucun produit publié' : 'Aucun produit trouvé'}
          </p>
          <p style={{ fontSize:13 }}>
            {onglet==='mes-produits' ? 'Cliquez sur "Publier un produit" pour commencer à vendre' : 'Essayez une autre catégorie'}
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:16 }}>
          {filtres.map(p => {
            const estMon = p.vendeur === user?.nom;
            return (
              <div key={p.id} style={{ background:'#fff', border:`1px solid ${estMon?'#bbf7d0':'#e8e8e8'}`, borderRadius:14, overflow:'hidden', transition:'box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; }}>
                {/* Image catégorie */}
                <div style={{ height:90, background:estMon?'#f0fdf4':'#f7f8fa', display:'flex', alignItems:'center', justifyContent:'center', fontSize:38, position:'relative' }}>
                  {EMOJIS_CAT[p.cat] || '📦'}
                  {estMon && (
                    <span style={{ position:'absolute', top:8, right:8, fontSize:10, padding:'2px 7px', borderRadius:10, background:'#16a34a', color:'#fff', fontWeight:700 }}>MON PRODUIT</span>
                  )}
                  {p.type === 'agriculteur' && !estMon && (
                    <span style={{ position:'absolute', top:8, right:8, fontSize:10, padding:'2px 7px', borderRadius:10, background:'#dbeafe', color:'#2563eb', fontWeight:700 }}>AGRICULTEUR</span>
                  )}
                </div>

                <div style={{ padding:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:5 }}>
                    <p style={{ margin:0, fontWeight:700, fontSize:14, color:'#111', lineHeight:1.3, flex:1, marginRight:6 }}>{p.nom}</p>
                    <StatutBadge statut={p.statut} />
                  </div>
                  <p style={{ margin:'0 0 3px', fontSize:12, color:'#888' }}>📦 {p.cat}</p>
                  <p style={{ margin:'0 0 6px', fontSize:12, color:'#888' }}>🏪 {p.vendeur}</p>
                  {p.description && <p style={{ margin:'0 0 8px', fontSize:11, color:'#aaa', lineHeight:1.4 }}>{p.description.slice(0,60)}...</p>}
                  <p style={{ margin:'0 0 2px', fontSize:11, color:'#aaa' }}>Stock : {p.qte} unités</p>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                    <span style={{ fontSize:18, fontWeight:800, color:'#16a34a' }}>{p.prix} DT</span>
                    <div style={{ display:'flex', gap:6 }}>
                      {estMon ? (
                        // Mes produits : bouton supprimer
                        <button onClick={() => supprimerMonProduit(p.id)}
                          style={{ padding:'6px 12px', borderRadius:8, border:'none', background:'#fee2e2', color:'#dc2626', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                          🗑 Retirer
                        </button>
                      ) : (
                        // Produits des autres : bouton acheter
                        <button onClick={() => setAchatModal(p)} disabled={p.statut==='rupture'}
                          style={{ padding:'6px 14px', borderRadius:8, border:'none', background:p.statut==='rupture'?'#f3f4f6':'#16a34a', color:p.statut==='rupture'?'#aaa':'#fff', fontSize:12, fontWeight:600, cursor:p.statut==='rupture'?'not-allowed':'pointer' }}>
                          {p.statut==='rupture' ? 'Indisponible' : 'Acheter'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {achatModal && <ModalAchat produit={achatModal} onClose={() => setAchatModal(null)} onConfirmer={handleAcheter} />}
      {publierModal && <ModalPublier onClose={() => setPublierModal(false)} onPublier={handlePublier} vendeur={user?.nom} />}
    </div>
  );
}