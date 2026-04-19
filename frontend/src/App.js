// src/App.js — ✅ VERSION FINALE NABTA (présentation PFE)
// Standalone - ne dépend pas de App.jsx
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout      from './components/Layout';
import AssistantIA from './components/AssistantIA';
import Login       from './pages/auth/Login';
import Register    from './pages/auth/Register';
import Home        from './pages/Home';

// ── Agriculteur ───────────────────────────────────────────────────────────────
import {
  DashboardAgriculteur,
  MesCultures,
  LivraisonAgriculteur,
} from './pages/agriculteur/index';
import MarketplaceAgriculteur from './pages/agriculteur/Marketplace';
import Contacts               from './pages/agriculteur/Contacts';

// ── Fournisseur ───────────────────────────────────────────────────────────────
import {
  DashboardFournisseur,
  StockFournisseur,
} from './pages/fournisseur/index';
import MarketplaceFournisseur from './pages/fournisseur/Marketplace';

// ── Vétérinaire ───────────────────────────────────────────────────────────────
import {
  DashboardVeterinaire,
  Consultations,
  RapportsMedicaux,
  HistoriqueVeterinaire,
} from './pages/veterinaire/index';

// ── Transporteur ──────────────────────────────────────────────────────────────
import {
  DashboardTransporteur,
  LivraisonsTransporteur,
  DemandesTransporteur,
  HistoriqueTransporteur,
} from './pages/transporteur/index';

// ── Admin ─────────────────────────────────────────────────────────────────────
import {
  DashboardAdmin,
  Utilisateurs,
  ProduitsAdmin,
  Statistiques,
} from './pages/admin/index';

// ══════════════════════════════════════════════════════════════════════════════
// GUARDS DE NAVIGATION
// ══════════════════════════════════════════════════════════════════════════════

function RoutePrivee({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f8fa', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:44, marginBottom:16 }}>🌿</div>
        <div style={{ width:36, height:36, border:'3px solid #e8e8e8', borderTopColor:'#16a34a', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
        <p style={{ marginTop:14, color:'#888', fontSize:14 }}>Chargement...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

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

// ══════════════════════════════════════════════════════════════════════════════
// APPLICATION PRINCIPALE
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition:true, v7_relativeSplatPath:true }}>
        <Routes>

          {/* ── Publiques ── */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<PublicRoute><Login    /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* ── Dashboard (redirige selon rôle) ── */}
          <Route path="/dashboard"
            element={<RoutePrivee><DashboardRouter /></RoutePrivee>} />

          {/* ══ AGRICULTEUR ══ */}
          <Route path="/mes-cultures"
            element={<RoutePrivee roles={['agriculteur']}><MesCultures /></RoutePrivee>} />
          <Route path="/marketplace"
            element={<RoutePrivee roles={['agriculteur']}><MarketplaceAgriculteur /></RoutePrivee>} />
          <Route path="/livraison"
            element={<RoutePrivee roles={['agriculteur']}><LivraisonAgriculteur /></RoutePrivee>} />
          <Route path="/contacts"
            element={<RoutePrivee roles={['agriculteur']}><Contacts /></RoutePrivee>} />

          {/* ══ FOURNISSEUR ══ */}
          <Route path="/marketplace-four"
            element={<RoutePrivee roles={['fournisseur']}><MarketplaceFournisseur /></RoutePrivee>} />
          <Route path="/commandes"
            element={<RoutePrivee roles={['fournisseur']}><DashboardFournisseur /></RoutePrivee>} />
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

          {/* ══ COMMUN (tous rôles) ══ */}
          <Route path="/assistant"
            element={<RoutePrivee><AssistantIA /></RoutePrivee>} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}