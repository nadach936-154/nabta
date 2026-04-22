// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/*
  Flux en 3 étapes :
  1. L'utilisateur saisit son email  → le backend envoie un code par email
  2. L'utilisateur saisit le code    → le backend valide
  3. L'utilisateur saisit le nouveau mot de passe et confirme

  Adapter les appels fetch() à votre API réelle.
*/

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [etape,       setEtape]      = useState(1);   // 1 | 2 | 3
  const [email,       setEmail]      = useState('');
  const [code,        setCode]       = useState('');
  const [mdp,         setMdp]        = useState('');
  const [mdpConf,     setMdpConf]    = useState('');
  const [showMdp,     setShowMdp]    = useState(false);
  const [showMdpConf, setShowMdpConf]= useState(false);
  const [loading,     setLoading]    = useState(false);
  const [erreur,      setErreur]     = useState('');
  const [succes,      setSucces]     = useState('');

  /* ── Icône œil ── */
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

  /* ── Styles partagés ── */
  const inputStyle = {
    width:'100%', border:'1px solid #e2e8f0', borderRadius:10,
    padding:'12px 16px', fontSize:14, outline:'none',
    boxSizing:'border-box', fontFamily:'inherit', color:'#111',
  };
  const labelStyle = {
    display:'block', fontSize:12, fontWeight:600, color:'#555',
    marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px',
  };
  const btnStyle = (disabled) => ({
    width:'100%', background:disabled?'#86a886':'#16a34a', color:'#fff',
    border:'none', borderRadius:10, padding:'13px', fontSize:15,
    fontWeight:700, cursor:disabled?'not-allowed':'pointer', fontFamily:'inherit',
    marginTop:4,
  });

  /* ── Étape 1 : envoyer le code ── */
  const envoyerCode = async (e) => {
    e.preventDefault();
    setLoading(true); setErreur(''); setSucces('');
    try {
      const res  = await fetch(`${API}/auth/forgot-password`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      setSucces(`Un code a été envoyé à ${email}`);
      setEtape(2);
    } catch (err) {
      setErreur(err.message);
    }
    setLoading(false);
  };

  /* ── Étape 2 : vérifier le code ── */
  const verifierCode = async (e) => {
    e.preventDefault();
    setLoading(true); setErreur(''); setSucces('');
    try {
      const res  = await fetch(`${API}/auth/verify-reset-code`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Code invalide');
      setSucces('Code vérifié ! Choisissez votre nouveau mot de passe.');
      setEtape(3);
    } catch (err) {
      setErreur(err.message);
    }
    setLoading(false);
  };

  /* ── Étape 3 : réinitialiser le mot de passe ── */
  const reinitialiserMdp = async (e) => {
    e.preventDefault();
    if (mdp !== mdpConf) { setErreur('Les mots de passe ne correspondent pas.'); return; }
    if (mdp.length < 6)  { setErreur('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setLoading(true); setErreur(''); setSucces('');
    try {
      const res  = await fetch(`${API}/auth/reset-password`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, code, newPassword: mdp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      setSucces('Mot de passe modifié avec succès ! Redirection...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setErreur(err.message);
    }
    setLoading(false);
  };

  /* ── Indicateur d'étapes ── */
  const Stepper = () => (
    <div style={{ display:'flex', alignItems:'center', marginBottom:32, gap:0 }}>
      {[
        { n:1, label:'Email' },
        { n:2, label:'Code'  },
        { n:3, label:'Nouveau mot de passe' },
      ].map(({ n, label }, idx) => (
        <div key={n} style={{ display:'flex', alignItems:'center', flex: idx < 2 ? 1 : 'none' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{
              width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:13,
              background: etape > n ? '#16a34a' : etape === n ? '#16a34a' : '#e2e8f0',
              color: etape >= n ? '#fff' : '#999',
            }}>
              {etape > n ? '✓' : n}
            </div>
            <span style={{ fontSize:11, color: etape >= n ? '#16a34a' : '#aaa', fontWeight:600, whiteSpace:'nowrap' }}>
              {label}
            </span>
          </div>
          {idx < 2 && (
            <div style={{ flex:1, height:2, background: etape > n ? '#16a34a' : '#e2e8f0', margin:'0 8px', marginBottom:20 }} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f7f8fa', display:'flex', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* Panneau gauche */}
      <div style={{ width:'45%', background:'#1a3a2a', color:'#fff', padding:'48px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.5px' }}>🌿 NABTA</div>
        <div>
          <div style={{ fontSize:56, marginBottom:20 }}>🔐</div>
          <h1 style={{ fontSize:28, fontWeight:700, lineHeight:1.3, margin:'0 0 16px' }}>
            Réinitialisation du mot de passe
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.8 }}>
            Pas de panique ! Saisissez votre adresse email, nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.
          </p>
          <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:12 }}>
            {[
              ['📧', 'Saisir votre email'],
              ['📩', 'Recevoir le code par email'],
              ['🔑', 'Créer un nouveau mot de passe'],
            ].map(([icon, texte], i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'center', background: etape > i ? 'rgba(22,163,74,0.25)' : etape === i+1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)', borderRadius:10, padding:'12px 14px', transition:'background 0.3s' }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <p style={{ margin:0, fontSize:13, fontWeight:600, color: etape > i+1 ? 'rgba(255,255,255,0.5)' : '#fff' }}>{texte}</p>
                {etape > i+1 && <span style={{ marginLeft:'auto', color:'#4ade80', fontSize:16 }}>✓</span>}
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
        <div style={{ width:'100%', maxWidth:440 }}>

          <h2 style={{ fontSize:24, fontWeight:700, color:'#111', margin:'0 0 6px' }}>Mot de passe oublié</h2>
          <p style={{ color:'#888', margin:'0 0 28px', fontSize:14 }}>
            Vous vous souvenez ?{' '}
            <Link to="/login" style={{ color:'#16a34a', fontWeight:700, textDecoration:'none' }}>
              Se connecter →
            </Link>
          </p>

          <Stepper />

          {/* Messages */}
          {erreur && (
            <div style={{ background:'#fff3cd', border:'1px solid #ffc107', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#856404', display:'flex', gap:8, alignItems:'flex-start' }}>
              <span>⚠️</span><span>{erreur}</span>
            </div>
          )}
          {succes && (
            <div style={{ background:'#dcfce7', border:'1px solid #86efac', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#166534', display:'flex', gap:8, alignItems:'flex-start' }}>
              <span>✅</span><span>{succes}</span>
            </div>
          )}

          {/* ── Étape 1 ── */}
          {etape === 1 && (
            <form onSubmit={envoyerCode}>
              <div style={{ marginBottom:20 }}>
                <label style={labelStyle}>Adresse email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="votre@email.tn" autoComplete="email"
                  style={inputStyle}
                />
                <p style={{ fontSize:12, color:'#aaa', marginTop:6 }}>
                  Entrez l'email associé à votre compte NABTA.
                </p>
              </div>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? '⏳ Envoi en cours...' : 'Envoyer le code →'}
              </button>
            </form>
          )}

          {/* ── Étape 2 ── */}
          {etape === 2 && (
            <form onSubmit={verifierCode}>
              <div style={{ marginBottom:8 }}>
                <label style={labelStyle}>Code de vérification</label>
                <input
                  type="text" value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                  required placeholder="_ _ _ _ _ _" maxLength={6}
                  style={{ ...inputStyle, textAlign:'center', fontSize:24, fontWeight:700, letterSpacing:12 }}
                />
                <p style={{ fontSize:12, color:'#aaa', marginTop:6 }}>
                  Vérifiez votre boîte mail à l'adresse <strong>{email}</strong>.
                </p>
              </div>
              <button type="submit" disabled={loading || code.length < 6} style={btnStyle(loading || code.length < 6)}>
                {loading ? '⏳ Vérification...' : 'Vérifier le code →'}
              </button>
              <button type="button" onClick={() => { setCode(''); setEtape(1); setErreur(''); setSucces(''); }}
                style={{ width:'100%', background:'none', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px', fontSize:14, color:'#555', cursor:'pointer', fontFamily:'inherit', marginTop:10 }}>
                ← Changer d'email
              </button>
            </form>
          )}

          {/* ── Étape 3 ── */}
          {etape === 3 && (
            <form onSubmit={reinitialiserMdp}>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>Nouveau mot de passe</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showMdp ? 'text' : 'password'}
                    value={mdp} onChange={e => setMdp(e.target.value)}
                    required placeholder="••••••••" minLength={6}
                    style={{ ...inputStyle, paddingRight:48 }}
                  />
                  <button type="button" onClick={() => setShowMdp(v => !v)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#888', padding:0, display:'flex', alignItems:'center' }}>
                    <EyeIcon open={showMdp} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={labelStyle}>Confirmer le mot de passe</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showMdpConf ? 'text' : 'password'}
                    value={mdpConf} onChange={e => setMdpConf(e.target.value)}
                    required placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight:48,
                      borderColor: mdpConf && mdp !== mdpConf ? '#f87171' : '#e2e8f0',
                    }}
                  />
                  <button type="button" onClick={() => setShowMdpConf(v => !v)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#888', padding:0, display:'flex', alignItems:'center' }}>
                    <EyeIcon open={showMdpConf} />
                  </button>
                </div>
                {mdpConf && mdp !== mdpConf && (
                  <p style={{ fontSize:12, color:'#ef4444', marginTop:4 }}>Les mots de passe ne correspondent pas.</p>
                )}
              </div>

              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? '⏳ Mise à jour...' : '🔑 Réinitialiser le mot de passe'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}