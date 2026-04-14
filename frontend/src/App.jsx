// src/App.jsx — version finale propre (sans imports anciens fichiers)
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout        from './components/Layout';
import AssistantIA   from './components/AssistantIA';
import Login         from './pages/auth/Login';
import Register      from './pages/auth/Register';

// ── Agriculteur ──
import {
  DashboardAgriculteur,
  MesCultures,
  MesProduitsAgriculteur,
  LivraisonAgriculteur,
  Reseau,
} from './pages/agriculteur/index';

// ── Fournisseur ──
import {
  DashboardFournisseur,
  MesProduitsFournisseur,
  CommandesFournisseur,
  StockFournisseur,
} from './pages/fournisseur/index';

// ── Vétérinaire ──
import {
  DashboardVeterinaire,
  Consultations,
  RapportsMedicaux,
  HistoriqueVeterinaire,
} from './pages/veterinaire/index';

// ── Transporteur ──
import {
  DashboardTransporteur,
  LivraisonsTransporteur,
  DemandesTransporteur,
  HistoriqueTransporteur,
} from './pages/transporteur/index';

// ── Admin ──
import {
  DashboardAdmin,
  Utilisateurs,
  ProduitsAdmin,
  Statistiques,
} from './pages/admin/index';

// ═══════════════════════════════════════════════════════
// PAGE D'ACCUEIL PUBLIQUE
// ═══════════════════════════════════════════════════════
function Home() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  return (
    <div style={{ minHeight:'100vh', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'16px 48px', background:'#fff', borderBottom:'1px solid #eee',
        position:'sticky', top:0, zIndex:100,
      }}>
        <span style={{ fontSize:20, fontWeight:800, color:'#1a3a2a', letterSpacing:'-0.5px' }}>
          🌿 NABTA
        </span>
        <div style={{ display:'flex', gap:10 }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:8, padding:'8px 20px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              Mon Dashboard →
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                style={{ background:'transparent', color:'#374151', border:'1px solid #e5e7eb', borderRadius:8, padding:'8px 20px', fontSize:14, cursor:'pointer' }}>
                Se connecter
              </button>
              <button onClick={() => navigate('/register')}
                style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:8, padding:'8px 20px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                S'inscrire →
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background:'#1a3a2a', color:'#fff', padding:'80px 48px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:20, padding:'4px 16px', fontSize:13, marginBottom:24 }}>
          🌱 Plateforme Agricole Intelligente · Tunisie
        </div>
        <h1 style={{ fontSize:48, fontWeight:800, margin:'0 0 18px', lineHeight:1.15 }}>
          L'agriculture tunisienne,<br />
          <span style={{ color:'#74c69d' }}>enfin numérisée</span>
        </h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.7)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
          Gérez vos cultures, vendez vos produits, consultez des vétérinaires et bénéficiez d'un assistant IA.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/register')}
            style={{ background:'#74c69d', color:'#1a3a2a', border:'none', borderRadius:10, padding:'13px 28px', fontSize:15, fontWeight:800, cursor:'pointer' }}>
            Créer un compte gratuit →
          </button>
          <button onClick={() => navigate('/login')}
            style={{ background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,0.35)', borderRadius:10, padding:'13px 28px', fontSize:15, cursor:'pointer' }}>
            Se connecter
          </button>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:'#fff', borderBottom:'1px solid #f0f0f0' }}>
        {[['500+','Agriculteurs'],['1 200+','Produits'],['80+','Professionnels'],['24/7','Assistant IA']].map(([n,l],i) => (
          <div key={l} style={{ textAlign:'center', padding:'22px', borderRight: i<3 ? '1px solid #f0f0f0' : 'none' }}>
            <p style={{ fontSize:26, fontWeight:800, color:'#1a3a2a', margin:0 }}>{n}</p>
            <p style={{ fontSize:13, color:'#888', margin:'3px 0 0' }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Rôles */}
      <section style={{ padding:'60px 48px', background:'#f7f8fa', textAlign:'center' }}>
        <h2 style={{ fontSize:24, fontWeight:700, margin:'0 0 8px', color:'#111' }}>5 acteurs, 1 plateforme</h2>
        <p style={{ fontSize:14, color:'#888', margin:'0 0 36px' }}>Chaque utilisateur a son espace dédié</p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', maxWidth:800, margin:'0 auto' }}>
          {[
            { e:'👨‍🌾', n:'Agriculteur',  d:'Cultures & vente',   bg:'#f0fdf4', c:'#16a34a' },
            { e:'🏪',   n:'Fournisseur',  d:'Produits agricoles', bg:'#fefce8', c:'#b45309' },
            { e:'🐄',   n:'Vétérinaire',  d:'Santé animale',      bg:'#eff6ff', c:'#2563eb' },
            { e:'🚚',   n:'Transporteur', d:'Livraisons',         bg:'#f5f3ff', c:'#7c3aed' },
            { e:'⚙️',   n:'Admin',        d:'Supervision',        bg:'#1a3a2a', c:'#fff'    },
          ].map(r => (
            <div key={r.n} style={{ background:r.bg, borderRadius:12, padding:'20px 18px', textAlign:'center', minWidth:130 }}>
              <span style={{ fontSize:28, display:'block', marginBottom:8 }}>{r.e}</span>
              <p style={{ fontSize:13, fontWeight:700, color:r.c, margin:'0 0 3px' }}>{r.n}</p>
              <p style={{ fontSize:11, color: r.n==='Admin' ? 'rgba(255,255,255,0.6)' : '#888', margin:0 }}>{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'#1a3a2a', color:'#fff', padding:'60px 48px', textAlign:'center' }}>
        <h2 style={{ fontSize:26, fontWeight:700, margin:'0 0 12px' }}>Rejoignez NABTA aujourd'hui</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', margin:'0 0 24px' }}>Inscription gratuite · Accès immédiat</p>
        <button onClick={() => navigate('/register')}
          style={{ background:'#74c69d', color:'#1a3a2a', border:'none', borderRadius:10, padding:'12px 28px', fontSize:15, fontWeight:800, cursor:'pointer' }}>
          Créer mon compte →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background:'#111', color:'rgba(255,255,255,0.4)', textAlign:'center', padding:'18px', fontSize:13 }}>
        © 2026 NABTA · ISMAIK · Ameni · Nada · Sara · Loujayn · Chourouk
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ROUTE PROTÉGÉE
// ═══════════════════════════════════════════════════════
function RoutePrivee({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f8fa' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:44, marginBottom:16 }}>🌿</div>
        <div style={{ width:36, height:36, border:'3px solid #e8e8e8', borderTopColor:'#16a34a', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
        <p style={{ marginTop:14, color:'#888', fontSize:14 }}>Chargement...</p>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!user)                               return <Navigate to="/login"     replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

// Redirige vers dashboard si déjà connecté
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user)    return <Navigate to="/dashboard" replace />;
  return children;
}

// ═══════════════════════════════════════════════════════
// DASHBOARD DYNAMIQUE (selon le rôle)
// ═══════════════════════════════════════════════════════
function DashboardRouter() {
  const { user } = useAuth();
  const map = {
    agriculteur:  <DashboardAgriculteur  />,
    fournisseur:  <DashboardFournisseur  />,
    veterinaire:  <DashboardVeterinaire  />,
    transporteur: <DashboardTransporteur />,
    admin:        <DashboardAdmin        />,
  };
  return map[user?.role] || <Navigate to="/login" replace />;
}

// ═══════════════════════════════════════════════════════
// APPLICATION PRINCIPALE
// ═══════════════════════════════════════════════════════
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition:true, v7_relativeSplatPath:true }}>
        <Routes>

          {/* ── Publiques ── */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<PublicRoute><Login    /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* ── Dashboard dynamique ── */}
          <Route path="/dashboard" element={<RoutePrivee><DashboardRouter /></RoutePrivee>} />

          {/* ══ AGRICULTEUR ══ */}
          <Route path="/mes-cultures"
            element={<RoutePrivee roles={['agriculteur']}><MesCultures /></RoutePrivee>} />
          <Route path="/mes-produits-agri"
            element={<RoutePrivee roles={['agriculteur']}><MesProduitsAgriculteur /></RoutePrivee>} />
          <Route path="/livraison"
            element={<RoutePrivee roles={['agriculteur']}><LivraisonAgriculteur /></RoutePrivee>} />
          <Route path="/reseau"
            element={<RoutePrivee roles={['agriculteur']}><Reseau /></RoutePrivee>} />

          {/* ══ FOURNISSEUR ══ */}
          <Route path="/mes-produits"
            element={<RoutePrivee roles={['fournisseur']}><MesProduitsFournisseur /></RoutePrivee>} />
          <Route path="/commandes"
            element={<RoutePrivee roles={['fournisseur']}><CommandesFournisseur /></RoutePrivee>} />
          <Route path="/stock"
            element={<RoutePrivee roles={['fournisseur']}><StockFournisseur /></RoutePrivee>} />

          {/* ══ VÉTÉRINAIRE ══ */}
          <Route path="/consultations"
            element={<RoutePrivee roles={['veterinaire']}><Consultations /></RoutePrivee>} />
          <Route path="/rapports"
            element={<RoutePrivee roles={['veterinaire']}><RapportsMedicaux /></RoutePrivee>} />
          <Route path="/historique-vet"
            element={<RoutePrivee roles={['veterinaire']}><HistoriqueVeterinaire /></RoutePrivee>} />

          {/* ══ TRANSPORTEUR ══ */}
          <Route path="/livraisons"
            element={<RoutePrivee roles={['transporteur']}><LivraisonsTransporteur /></RoutePrivee>} />
          <Route path="/demandes"
            element={<RoutePrivee roles={['transporteur']}><DemandesTransporteur /></RoutePrivee>} />
          <Route path="/historique-trans"
            element={<RoutePrivee roles={['transporteur']}><HistoriqueTransporteur /></RoutePrivee>} />

          {/* ══ ADMIN ══ */}
          <Route path="/admin"
            element={<RoutePrivee roles={['admin']}><Utilisateurs /></RoutePrivee>} />
          <Route path="/produits"
            element={<RoutePrivee roles={['admin']}><ProduitsAdmin /></RoutePrivee>} />
          <Route path="/statistiques"
            element={<RoutePrivee roles={['admin']}><Statistiques /></RoutePrivee>} />

          {/* ══ COMMUN tous rôles ══ */}
          <Route path="/assistant"
            element={<RoutePrivee><AssistantIA /></RoutePrivee>} />

          {/* ══ Fallback ══ */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}