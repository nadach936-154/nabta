// src/pages/Home.jsx — Page d'accueil améliorée
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const FEATURES = [
    { icon:'🌾', titre:'Gestion des Cultures',   desc:'Suivez vos parcelles, cultures, stades de croissance et santé de vos champs en temps réel.',            color:'#16a34a' },
    { icon:'🛒', titre:'Marketplace Agricole',   desc:'Achetez et vendez des produits agricoles. Fournisseurs, agriculteurs — tous sur une seule plateforme.',  color:'#b45309' },
    { icon:'🤖', titre:'Assistant IA',           desc:'Posez n\'importe quelle question. Agriculture, technologie, cuisine — je réponds 24h/24.',               color:'#2563eb' },
    { icon:'📅', titre:'Rendez-vous Vétérinaires',desc:'Prenez contact avec des vétérinaires qualifiés. Urgences gérées en priorité.',                         color:'#7c3aed' },
    { icon:'🚚', titre:'Gestion des Livraisons', desc:'Suivez vos commandes de la passation à la livraison. Transporteurs certifiés.',                          color:'#0891b2' },
    { icon:'📊', titre:'Tableau de Bord Pro',    desc:'Chaque rôle dispose de son espace dédié avec statistiques, alertes et activités en temps réel.',         color:'#dc2626' },
  ];

  const STATS = [
    { val:'500+', lbl:'Agriculteurs'    },
    { val:'1 200+', lbl:'Produits'       },
    { val:'80+', lbl:'Professionnels'   },
    { val:'24/7', lbl:'Assistant IA'    },
  ];

  const ROLES = [
    { e:'👨‍🌾', n:'Agriculteur',  d:'Cultivez, vendez, progressez',    bg:'#f0fdf4', c:'#16a34a', b:'#bbf7d0' },
    { e:'🏪',   n:'Fournisseur',  d:'Gérez produits & commandes',       bg:'#fefce8', c:'#b45309', b:'#fde68a' },
    { e:'🐄',   n:'Vétérinaire',  d:'Consultations & rapports',         bg:'#eff6ff', c:'#2563eb', b:'#bfdbfe' },
    { e:'🚚',   n:'Transporteur', d:'Livraisons & tournées',            bg:'#f5f3ff', c:'#7c3aed', b:'#ddd6fe' },
    { e:'⚙️',   n:'Administrateur',d:'Supervision complète',            bg:'#1a3a2a', c:'#fff',    b:'#2d5a3d' },
  ];

  const TEMOIGNAGES = [
    { nom:'Ahmed B.', role:'Agriculteur, Ariana', texte:'Grâce à NABTA, j\'ai trouvé des fournisseurs fiables et j\'ai augmenté mon rendement de 30% cette saison.', avatar:'AB' },
    { nom:'Dr. Karim M.', role:'Vétérinaire, Nabeul', texte:'Je reçois les demandes de RDV directement sur mon tableau de bord. Plus besoin de téléphone !', avatar:'KM' },
    { nom:'Nour Z.', role:'Transporteur, Sfax', texte:'J\'accepte de nouvelles livraisons chaque jour. L\'application est simple et très efficace.', avatar:'NZ' },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", overflowX:'hidden' }}>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 64px', background:'rgba(255,255,255,0.97)', backdropFilter:'blur(10px)', borderBottom:'1px solid #f0f0f0', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:24 }}>🌿</span>
          <span style={{ fontSize:20, fontWeight:800, color:'#1a3a2a', letterSpacing:'-0.5px' }}>NABTA</span>
          <span style={{ fontSize:11, background:'#f0fdf4', color:'#16a34a', padding:'2px 8px', borderRadius:10, fontWeight:600, marginLeft:4 }}>Bêta</span>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')}
              style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:'9px 20px', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              Mon Dashboard →
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                style={{ background:'transparent', color:'#374151', border:'1px solid #e5e7eb', borderRadius:9, padding:'8px 18px', fontSize:14, cursor:'pointer' }}>
                Se connecter
              </button>
              <button onClick={() => navigate('/register')}
                style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:'9px 20px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                S'inscrire gratuitement →
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{ background:'#1a3a2a', color:'#fff', padding:'90px 64px', position:'relative', overflow:'hidden' }}>
        {/* Cercles décoratifs */}
        <div style={{ position:'absolute', top:-100, right:-100, width:500, height:500, borderRadius:'50%', background:'rgba(116,198,157,0.1)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'rgba(116,198,157,0.08)', pointerEvents:'none' }} />

        <div style={{ maxWidth:700, position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(116,198,157,0.18)', border:'1px solid rgba(116,198,157,0.3)', borderRadius:20, padding:'5px 14px', marginBottom:24, fontSize:13, color:'#74c69d' }}>
            🇹🇳 Plateforme officielle · Tunisie
          </div>
          <h1 style={{ fontSize:52, fontWeight:800, lineHeight:1.1, margin:'0 0 20px', letterSpacing:'-1px' }}>
            L'agriculture tunisienne,<br />
            <span style={{ color:'#74c69d' }}>enfin numérisée</span>
          </h1>
          <p style={{ fontSize:18, color:'rgba(255,255,255,0.75)', lineHeight:1.7, margin:'0 0 36px', maxWidth:560 }}>
            NABTA connecte agriculteurs, fournisseurs, vétérinaires et transporteurs sur une seule plateforme intelligente — avec IA intégrée.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <button onClick={() => navigate('/register')}
              style={{ background:'#74c69d', color:'#1a3a2a', border:'none', borderRadius:10, padding:'14px 30px', fontSize:15, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              Créer mon compte gratuit →
            </button>
            <button onClick={() => navigate('/login')}
              style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.25)', borderRadius:10, padding:'14px 28px', fontSize:15, cursor:'pointer' }}>
              Se connecter
            </button>
          </div>

          {/* Badge trust */}
          <div style={{ display:'flex', gap:20, marginTop:32, flexWrap:'wrap' }}>
            {['✅ Inscription gratuite','🔐 Sécurisé & certifié','⚡ Accès immédiat'].map(b => (
              <span key={b} style={{ fontSize:13, color:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', gap:4 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <div style={{ background:'#fff', borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', maxWidth:1000, margin:'0 auto' }}>
          {STATS.map((s,i) => (
            <div key={s.lbl} style={{ textAlign:'center', padding:'28px 20px', borderRight:i<3?'1px solid #f0f0f0':'none' }}>
              <p style={{ fontSize:32, fontWeight:800, color:'#1a3a2a', margin:'0 0 4px', letterSpacing:'-1px' }}>{s.val}</p>
              <p style={{ fontSize:13, color:'#888', margin:0 }}>{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════ FONCTIONNALITÉS ══════════════════ */}
      <section style={{ padding:'80px 64px', background:'#f7f8fa' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:34, fontWeight:700, margin:'0 0 12px', color:'#111', letterSpacing:'-0.5px' }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ fontSize:16, color:'#888', margin:0, maxWidth:500, margin:'0 auto' }}>
            Une plateforme complète pour moderniser votre activité agricole
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, maxWidth:1000, margin:'0 auto' }}>
          {FEATURES.map(f => (
            <div key={f.titre} style={{ background:'#fff', borderRadius:14, padding:'24px 22px', border:'1px solid #e8e8e8', transition:'all 0.2s', cursor:'default' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=f.color+'60'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#e8e8e8'; }}>
              <div style={{ width:48, height:48, borderRadius:12, background:f.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:14 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, margin:'0 0 8px', color:'#111' }}>{f.titre}</h3>
              <p style={{ fontSize:14, color:'#888', margin:0, lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ 5 RÔLES ══════════════════ */}
      <section style={{ padding:'80px 64px', background:'#fff' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:34, fontWeight:700, margin:'0 0 12px', color:'#111', letterSpacing:'-0.5px' }}>5 acteurs, 1 écosystème</h2>
          <p style={{ fontSize:16, color:'#888', margin:0 }}>Chaque utilisateur dispose de son espace personnalisé</p>
        </div>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', maxWidth:900, margin:'0 auto' }}>
          {ROLES.map(r => (
            <div key={r.n} style={{ background:r.bg, border:`1px solid ${r.b}`, borderRadius:14, padding:'24px 18px', textAlign:'center', minWidth:148, flex:'1 1 140px', maxWidth:170, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${r.c}30`; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
              onClick={() => navigate('/register')}>
              <span style={{ fontSize:36, display:'block', marginBottom:10 }}>{r.e}</span>
              <p style={{ fontSize:14, fontWeight:700, color:r.c, margin:'0 0 4px' }}>{r.n}</p>
              <p style={{ fontSize:12, color:r.n==='Administrateur'?'rgba(255,255,255,0.6)':'#888', margin:0, lineHeight:1.4 }}>{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ TÉMOIGNAGES ══════════════════ */}
      <section style={{ padding:'80px 64px', background:'#f7f8fa' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:34, fontWeight:700, margin:'0 0 12px', color:'#111', letterSpacing:'-0.5px' }}>Ils nous font confiance</h2>
          <p style={{ fontSize:16, color:'#888', margin:0 }}>Des professionnels agricoles à travers toute la Tunisie</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, maxWidth:900, margin:'0 auto' }}>
          {TEMOIGNAGES.map(t => (
            <div key={t.nom} style={{ background:'#fff', borderRadius:14, padding:'24px', border:'1px solid #e8e8e8' }}>
              <div style={{ fontSize:24, color:'#16a34a', marginBottom:12 }}>❝</div>
              <p style={{ fontSize:14, color:'#555', lineHeight:1.7, margin:'0 0 18px', fontStyle:'italic' }}>{t.texte}</p>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'#1a3a2a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>{t.avatar}</div>
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:13, color:'#111' }}>{t.nom}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ CTA FINAL ══════════════════ */}
      <section style={{ background:'#1a3a2a', color:'#fff', padding:'80px 64px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50%', left:'50%', transform:'translateX(-50%)', width:'60%', height:'200%', background:'radial-gradient(ellipse, rgba(116,198,157,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'relative' }}>
          <h2 style={{ fontSize:38, fontWeight:800, margin:'0 0 14px', letterSpacing:'-0.5px' }}>
            Rejoignez NABTA aujourd'hui
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.65)', margin:'0 0 32px' }}>
            Inscription gratuite · Accès immédiat · Aucune carte bancaire requise
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => navigate('/register')}
              style={{ background:'#74c69d', color:'#1a3a2a', border:'none', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, cursor:'pointer' }}>
              Créer mon compte gratuitement →
            </button>
          </div>
          <p style={{ marginTop:16, fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            Déjà inscrit ?{' '}
            <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', textDecoration:'underline', fontSize:13 }}>
              Se connecter
            </button>
          </p>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ background:'#111', color:'rgba(255,255,255,0.5)', padding:'28px 64px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>🌿</span>
            <span style={{ fontWeight:700, color:'rgba(255,255,255,0.7)' }}>NABTA</span>
          </div>
          <p style={{ margin:0, fontSize:13 }}>
            © 2026 NABTA · Plateforme Agricole Intelligente · ISMAIK
          </p>
          <p style={{ margin:0, fontSize:12 }}>
            Ameni · Nada · Sara · Loujayn · Chourouk
          </p>
        </div>
      </footer>
    </div>
  );
}