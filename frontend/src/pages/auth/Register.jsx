// src/pages/auth/Register.jsx
// Validation CIN : fonctionne en LOCAL (pas besoin du backend pour ça)
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ═══════════════════════════════════════════════════════════════════
// BASE DE DONNÉES LOCALE — Ministère Agriculture Tunisie (simulée)
// ═══════════════════════════════════════════════════════════════════
const DB_MINISTERE = {
  '12345678': { nom:'Ahmed B.',     gouvernorat:'Ariana',      type:'Céréales',       surface:'12 ha' },
  '23456789': { nom:'Mohamed T.',   gouvernorat:'Kairouan',    type:'Maraîchage',     surface:'8 ha'  },
  '34567890': { nom:'Hassan F.',    gouvernorat:'Béja',        type:'Céréales',       surface:'25 ha' },
  '45678901': { nom:'Fatma G.',     gouvernorat:'Médenine',    type:'Palmier dattier',surface:'5 ha'  },
  '56789012': { nom:'Karim H.',     gouvernorat:'Sfax',        type:'Arboriculture',  surface:'15 ha' },
  '67890123': { nom:'Leila M.',     gouvernorat:'Bizerte',     type:'Maraîchage',     surface:'6 ha'  },
  '78901234': { nom:'Omar B.',      gouvernorat:'Sousse',      type:'Oliviers',       surface:'20 ha' },
  '89012345': { nom:'Amina Z.',     gouvernorat:'Nabeul',      type:'Maraîchage',     surface:'4 ha'  },
  '90123456': { nom:'Ridha C.',     gouvernorat:'Gafsa',       type:'Céréales',       surface:'30 ha' },
  '11223344': { nom:'Nadia J.',     gouvernorat:'Mahdia',      type:'Maraîchage',     surface:'7 ha'  },
  '22334455': { nom:'Tarek B.',     gouvernorat:'Jendouba',    type:'Céréales',       surface:'18 ha' },
  '33445566': { nom:'Sonia K.',     gouvernorat:'Monastir',    type:'Oliviers',       surface:'10 ha' },
  '44556677': { nom:'Ali S.',       gouvernorat:'Gabès',       type:'Maraîchage',     surface:'9 ha'  },
  '55667788': { nom:'Mounira D.',   gouvernorat:'Le Kef',      type:'Élevage bovin',  surface:'40 ha' },
  '66778899': { nom:'Hedi N.',      gouvernorat:'Siliana',     type:'Arboriculture',  surface:'12 ha' },
  '77889900': { nom:'Ikram B.',     gouvernorat:'Kébili',      type:'Palmier dattier',surface:'8 ha'  },
  '88990011': { nom:'Nada C.',      gouvernorat:'Tunis',       type:'Admin',          surface:'—'     },
  '99001122': { nom:'Mokhtar B.',   gouvernorat:'Kasserine',   type:'Céréales',       surface:'22 ha' },
  '10203040': { nom:'Wissal C.',    gouvernorat:'Zaghouan',    type:'Maraîchage',     surface:'5 ha'  },
  '20304050': { nom:'Bilel M.',     gouvernorat:'Sidi Bouzid', type:'Céréales',       surface:'16 ha' },
};

const verifierCINLocal = (cin) => {
  if (!cin || cin.length !== 8 || !/^\d{8}$/.test(cin)) {
    return { valide: false, raison: 'format' };
  }
  const info = DB_MINISTERE[cin];
  if (!info) {
    return { valide: false, raison: 'absent' };
  }
  return { valide: true, info };
};

// ═══════════════════════════════════════════════════════════════════
const ROLES = [
  { value:'agriculteur',  icon:'👨‍🌾', label:'Agriculteur',  desc:'Cultures & vente'   },
  { value:'fournisseur',  icon:'🏪',   label:'Fournisseur',  desc:'Produits agricoles'  },
  { value:'veterinaire',  icon:'🐄',   label:'Vétérinaire',  desc:'Santé animale'       },
  { value:'transporteur', icon:'🚚',   label:'Transporteur', desc:'Livraisons'          },
];

const inp = {
  width:'100%', border:'1px solid #e2e8f0', borderRadius:9,
  padding:'10px 14px', fontSize:14, outline:'none',
  boxSizing:'border-box', fontFamily:'inherit', color:'#111',
};
const lbl = {
  display:'block', fontSize:12, fontWeight:600, color:'#555',
  marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px',
};

export default function Register() {
  const [form, setForm] = useState({
    nom:'', email:'', motDePasse:'', role:'agriculteur',
    telephone:'', adresse:'', cin:'',
  });
  const [cinEtat, setCinEtat] = useState('idle');
  // idle | checking | valid | invalid_format | not_found
  const [cinInfo, setCinInfo] = useState(null);
  const [erreur,  setErreur]  = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // ── Vérification CIN (locale, instantanée) ────────────────────────────────
  const handleCINChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setForm(f => ({ ...f, cin: val }));

    if (val.length < 8) {
      setCinEtat('idle');
      setCinInfo(null);
      return;
    }

    // Simulation délai vérification
    setCinEtat('checking');
    setTimeout(() => {
      const result = verifierCINLocal(val);
      if (result.valide) {
        setCinEtat('valid');
        setCinInfo(result.info);
        if (!form.adresse) setForm(f => ({ ...f, adresse: result.info.gouvernorat }));
      } else if (result.raison === 'format') {
        setCinEtat('invalid_format');
        setCinInfo(null);
      } else {
        setCinEtat('not_found');
        setCinInfo(null);
      }
    }, 400);
  };

  // ── Soumission ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    if (form.motDePasse.length < 6) {
      return setErreur('Le mot de passe doit contenir au moins 6 caractères.');
    }
    if (form.role === 'agriculteur' && cinEtat !== 'valid') {
      return setErreur('Votre CIN doit être validé par le Ministère de l\'Agriculture.');
    }

    setLoading(true);
    const result = await register(form);
    if (result.success) navigate('/dashboard');
    else setErreur(result.message);
    setLoading(false);
  };

  // ── Rendu état CIN ─────────────────────────────────────────────────────────
  const cinBorder = { idle:'#e2e8f0', checking:'#f59e0b', valid:'#16a34a', invalid_format:'#ef4444', not_found:'#ef4444' }[cinEtat];

  const cinMsg = {
    checking:       { bg:'#fefce8', color:'#b45309', text:'⏳ Vérification Ministère Agriculture...' },
    valid:          { bg:'#f0fdf4', color:'#16a34a', text:'✅ CIN validé par le Ministère de l\'Agriculture' },
    invalid_format: { bg:'#fff5f5', color:'#dc2626', text:'❌ Format invalide — saisissez 8 chiffres' },
    not_found:      { bg:'#fff5f5', color:'#dc2626', text:'❌ CIN non enregistré au Ministère de l\'Agriculture. Contactez votre délégation agricole régionale.' },
  }[cinEtat];

  const btnDisabled = loading || (form.role === 'agriculteur' && cinEtat !== 'valid');

  return (
    <div style={{ minHeight:'100vh', background:'#f7f8fa', display:'flex', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── Panneau gauche ── */}
      <div style={{ width:'38%', background:'#1a3a2a', color:'#fff', padding:'40px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ fontSize:22, fontWeight:800 }}>🌿 NABTA</div>

        <div>
          <h2 style={{ fontSize:24, fontWeight:700, lineHeight:1.3, margin:'0 0 12px' }}>
            Rejoignez la plateforme agricole intelligente
          </h2>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.7, margin:'0 0 20px' }}>
            Inscription gratuite · Accès immédiat · Espace dédié à votre rôle
          </p>

          <div style={{ background:'rgba(255,193,7,0.15)', border:'1px solid rgba(255,193,7,0.3)', borderRadius:10, padding:'12px 14px', marginBottom:20 }}>
            <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:13, color:'#fbbf24' }}>
              🏛️ Vérification CIN Ministère Agriculture
            </p>
            <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.6 }}>
              Les agriculteurs doivent avoir leur CIN enregistré au Ministère de l'Agriculture de Tunisie.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {ROLES.map(r => (
              <div key={r.value} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.09)', borderRadius:8, padding:'9px 12px' }}>
                <span style={{ fontSize:16 }}>{r.icon}</span>
                <span style={{ fontSize:13, fontWeight:600 }}>{r.label}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginLeft:'auto' }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', margin:0 }}>
          🇹🇳 Ministère de l'Agriculture · Tunisie
        </p>
      </div>

      {/* ── Panneau droit ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 40px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:500 }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#111', margin:'0 0 4px' }}>Créer un compte</h2>
          <p style={{ color:'#888', margin:'0 0 22px', fontSize:14 }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color:'#16a34a', fontWeight:700, textDecoration:'none' }}>Se connecter</Link>
          </p>

          {erreur && (
            <div style={{ background:'#fff3cd', border:'1px solid #ffc107', borderRadius:9, padding:'11px 14px', marginBottom:18, fontSize:13, color:'#856404' }}>
              ⚠️ {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nom + Téléphone */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div>
                <label style={lbl}>Nom complet</label>
                <input style={inp} value={form.nom} onChange={e => setForm({...form,nom:e.target.value})} placeholder="Ahmed Ben Ali" required />
              </div>
              <div>
                <label style={lbl}>Téléphone</label>
                <input style={inp} value={form.telephone} onChange={e => setForm({...form,telephone:e.target.value})} placeholder="+216 XX XXX XXX" />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="votre@email.tn" required />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Mot de passe</label>
              <input style={inp} type="password" value={form.motDePasse} onChange={e => setForm({...form,motDePasse:e.target.value})} placeholder="Minimum 6 caractères" required minLength={6} />
              {form.motDePasse.length > 0 && (
                <div style={{ display:'flex', gap:3, marginTop:5 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ flex:1, height:3, borderRadius:2, transition:'background 0.2s',
                      background: i <= form.motDePasse.length
                        ? (form.motDePasse.length < 3 ? '#ef4444' : form.motDePasse.length < 5 ? '#f59e0b' : '#16a34a')
                        : '#e5e7eb' }} />
                  ))}
                </div>
              )}
            </div>

            {/* CIN */}
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>
                CIN
                {form.role === 'agriculteur' && (
                  <span style={{ color:'#dc2626', marginLeft:4, fontWeight:700 }}>* obligatoire pour agriculteur</span>
                )}
              </label>
              <input
                style={{ ...inp, borderColor: cinBorder, transition:'border-color 0.2s' }}
                value={form.cin}
                onChange={handleCINChange}
                placeholder="8 chiffres"
                maxLength={8}
              />

              {/* Message CIN */}
              {cinMsg && (
                <div style={{ marginTop:6, background:cinMsg.bg, border:`1px solid ${cinBorder}40`, borderRadius:7, padding:'8px 12px', fontSize:12, color:cinMsg.color }}>
                  {cinMsg.text}
                </div>
              )}

              {/* Infos agriculteur du Ministère */}
              {cinEtat === 'valid' && cinInfo && (
                <div style={{ marginTop:8, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'10px 14px' }}>
                  <p style={{ margin:'0 0 8px', fontWeight:700, color:'#16a34a', fontSize:13 }}>
                    🏛️ Informations Ministère Agriculture
                  </p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5, fontSize:12, color:'#555' }}>
                    <p style={{ margin:0 }}>📍 Gouvernorat : <strong>{cinInfo.gouvernorat}</strong></p>
                    <p style={{ margin:0 }}>🌾 Exploitation : <strong>{cinInfo.type}</strong></p>
                    <p style={{ margin:0 }}>📐 Surface : <strong>{cinInfo.surface}</strong></p>
                  </div>
                </div>
              )}

              {cinEtat === 'idle' && form.role === 'agriculteur' && (
                <p style={{ margin:'4px 0 0', fontSize:11, color:'#888' }}>
                  🏛️ CIN vérifié dans la base du Ministère Agriculture
                </p>
              )}
            </div>

            {/* Adresse */}
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Adresse / Ville</label>
              <input style={inp} value={form.adresse} onChange={e => setForm({...form,adresse:e.target.value})} placeholder="Tunis, Ariana..." />
            </div>

            {/* Rôle */}
            <div style={{ marginBottom:6 }}>
              <label style={lbl}>Je suis un(e)</label>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
              {ROLES.map(r => {
                const sel = form.role === r.value;
                return (
                  <div key={r.value} onClick={() => setForm({...form, role:r.value})}
                    style={{ border:`1.5px solid ${sel?'#16a34a':'#e2e8f0'}`, background:sel?'#f0fdf4':'#fff', borderRadius:9, padding:'10px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.12s' }}>
                    <span style={{ fontSize:18 }}>{r.icon}</span>
                    <div>
                      <p style={{ margin:0, fontSize:13, fontWeight:sel?700:500, color:sel?'#16a34a':'#374151' }}>{r.label}</p>
                      <p style={{ margin:0, fontSize:11, color:'#888' }}>{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="submit" disabled={btnDisabled}
              style={{
                width:'100%',
                background: btnDisabled ? '#9ca3af' : '#16a34a',
                color:'#fff', border:'none', borderRadius:9, padding:'12px',
                fontSize:15, fontWeight:700,
                cursor: btnDisabled ? 'not-allowed' : 'pointer',
                fontFamily:'inherit',
              }}>
              {loading ? '⏳ Création en cours...' : 'Créer mon compte →'}
            </button>

            {form.role === 'agriculteur' && cinEtat !== 'valid' && (
              <p style={{ textAlign:'center', fontSize:12, color:'#9ca3af', marginTop:8 }}>
                ℹ️ Entrez un CIN valide du Ministère pour activer l'inscription
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}