// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form,      setForm]    = useState({ email:'', motDePasse:'' });
  const [erreur,    setErreur]  = useState('');
  const [loading,   setLoading] = useState(false);
  const [showPass,  setShowPass]= useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    const result = await login(form.email, form.motDePasse);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErreur(result.message);
    }
    setLoading(false);
  };

  const EyeIcon = ({ open }) => open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f7f8fa', display:'flex', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* Panneau gauche */}
      <div style={{ width:'45%', background:'#1a3a2a', color:'#fff', padding:'48px 48px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.5px' }}>🌿 NABTA</div>
        <div>
          <div style={{ fontSize:56, marginBottom:20 }}>🌾</div>
          <h1 style={{ fontSize:30, fontWeight:700, lineHeight:1.3, margin:'0 0 16px' }}>
            Bienvenue sur la plateforme agricole intelligente
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.8, margin:'0 0 36px' }}>
            Gérez vos cultures, vendez vos produits et connectez-vous avec les professionnels agricoles de Tunisie.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              ['👨‍🌾','Agriculteurs','Cultures, vente et commandes'],
              ['🏪','Fournisseurs','Gérez vos produits et commandes'],
              ['🐄','Vétérinaires','Consultations et rapports médicaux'],
              ['🚚','Transporteurs','Livraisons et tournées'],
            ].map(([icon,titre,desc]) => (
              <div key={titre} style={{ display:'flex', gap:12, alignItems:'center', background:'rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px' }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <div>
                  <p style={{ margin:0, fontWeight:600, fontSize:13 }}>{titre}</p>
                  <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.5)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', margin:0 }}>
          Ministère de l'Agriculture · Tunisie 🇹🇳
        </p>
      </div>

      {/* Panneau droit */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:48 }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:'#111', margin:'0 0 6px' }}>Se connecter</h2>
          <p style={{ color:'#888', margin:'0 0 32px', fontSize:14 }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color:'#16a34a', fontWeight:700, textDecoration:'none' }}>S'inscrire →</Link>
          </p>

          {erreur && (
            <div style={{ background:'#fff3cd', border:'1px solid #ffc107', borderRadius:10, padding:'12px 16px', marginBottom:22, fontSize:13, color:'#856404', display:'flex', gap:8, alignItems:'flex-start' }}>
              <span style={{ flexShrink:0 }}>⚠️</span>
              <span>{erreur}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm({...form, email:e.target.value})}
                required placeholder="votre@email.tn" autoComplete="email"
                style={{ width:'100%', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px 16px', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit', color:'#111' }}
              />
            </div>

            {/* Mot de passe avec icône œil */}
            <div style={{ marginBottom:8 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Mot de passe</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.motDePasse}
                  onChange={e => setForm({...form, motDePasse:e.target.value})}
                  required placeholder="••••••••" autoComplete="current-password"
                  style={{ width:'100%', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px 48px 12px 16px', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit', color:'#111' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#888', padding:0, display:'flex', alignItems:'center' }}
                  title={showPass ? 'Masquer' : 'Afficher'}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Lien mot de passe oublié */}
            <div style={{ textAlign:'right', marginBottom:24 }}>
              <Link to="/forgot-password" style={{ fontSize:13, color:'#16a34a', fontWeight:600, textDecoration:'none' }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              style={{ width:'100%', background:loading?'#86a886':'#16a34a', color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit' }}>
              {loading ? '⏳ Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'#aaa' }}>
            <Link to="/" style={{ color:'#aaa', textDecoration:'none' }}>← Retour à l'accueil</Link>
          </p>
        </div>
      </div>
    </div>
  );
}