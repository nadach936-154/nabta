// src/components/Layout.jsx
// ✅ BUG 1 corrigé : panneau notifications fonctionnel
// ✅ BUG 5 ajouté : lien vers page Paramètres
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notifStore } from '../store/notifications';

const MENUS = {
  agriculteur: [
    { path:'/dashboard',       icon:'⊞', label:'Dashboard'    },
    { path:'/mes-cultures',    icon:'🌾', label:'Mes Cultures'  },
    { path:'/marketplace',     icon:'🛒', label:'Marketplace'   },
    { path:'/livraison',       icon:'📦', label:'Livraison'     },
    { path:'/contacts',        icon:'📞', label:'Contacts'      },
    { path:'/assistant',       icon:'🤖', label:'Assistant IA'  },
    { path:'/parametres',      icon:'⚙️', label:'Paramètres'    },
  ],
  fournisseur: [
    { path:'/dashboard',       icon:'⊞', label:'Dashboard'    },
    { path:'/marketplace-four',icon:'🛒', label:'Marketplace'  },
    { path:'/commandes',       icon:'🛒', label:'Commandes'    },
    { path:'/stock',           icon:'📊', label:'Stock'        },
    { path:'/assistant',       icon:'🤖', label:'Assistant IA' },
    { path:'/parametres',      icon:'⚙️', label:'Paramètres'  },
  ],
  veterinaire: [
    { path:'/dashboard',       icon:'⊞', label:'Dashboard'       },
    { path:'/consultations',   icon:'📅', label:'Consultations'   },
    { path:'/rapports',        icon:'📋', label:'Rapports médicaux'},
    { path:'/historique-vet',  icon:'🕐', label:'Historique'      },
    { path:'/assistant',       icon:'🤖', label:'Assistant IA'    },
    { path:'/parametres',      icon:'⚙️', label:'Paramètres'     },
  ],
  transporteur: [
    { path:'/dashboard',       icon:'⊞', label:'Dashboard'   },
    { path:'/livraisons',      icon:'🚚', label:'Livraisons'  },
    { path:'/demandes',        icon:'📬', label:'Demandes'    },
    { path:'/historique-trans',icon:'🕐', label:'Historique'  },
    { path:'/assistant',       icon:'🤖', label:'Assistant IA'},
    { path:'/parametres',      icon:'⚙️', label:'Paramètres' },
  ],
  admin: [
    { path:'/dashboard',       icon:'⊞', label:'Dashboard'   },
    { path:'/admin',           icon:'👥', label:'Utilisateurs' },
    { path:'/produits',        icon:'📦', label:'Produits'     },
    { path:'/statistiques',    icon:'📈', label:'Statistiques' },
    { path:'/parametres',      icon:'⚙️', label:'Paramètres'  },
  ],
};

const ROLE_COLOR = {
  agriculteur:'#16a34a', fournisseur:'#b45309',
  veterinaire:'#2563eb', transporteur:'#7c3aed', admin:'#dc2626',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [collapsed,    setCollapsed]    = useState(false);
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [notifications,setNotifications]= useState([]);
  const notifRef = useRef(null);

  const menu      = MENUS[user?.role] || [];
  const roleColor = ROLE_COLOR[user?.role] || '#16a34a';
  const initiales = user?.nom?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';
  const isActive  = (path) => location.pathname === path;

  // ── Charger les notifications ────────────────────────────────────────────
  useEffect(() => {
    const charger = () => {
      if (user?.email) {
        setNotifications(notifStore.forUser(user.email).slice(0, 20));
      }
    };
    charger();
    const t = setInterval(charger, 3000);
    return () => clearInterval(t);
  }, [user?.email]);

  // ── Fermer panneau si clic ailleurs ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.lu).length;

  const marquerTousLus = () => {
    notifStore.markAllRead(user?.email);
    setNotifications(notifStore.forUser(user.email).slice(0, 20));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const iconNotif = (type) => ({
    rdv:'📅', urgence:'🚨', commande:'🛒', message:'✉️', demande:'📋',
  }[type] || '🔔');

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f7f8fa', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:collapsed?60:220, background:'#fff', borderRight:'1px solid #eaecef', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky', top:0, height:'100vh', transition:'width 0.2s ease', overflow:'hidden', zIndex:50, boxShadow:'2px 0 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding:collapsed?'16px 0':'16px 18px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:10, justifyContent:collapsed?'center':'flex-start', minHeight:60, flexShrink:0 }}>
          <span style={{ fontSize:22, color:'#16a34a', flexShrink:0 }}>🌿</span>
          {!collapsed && <span style={{ fontWeight:800, fontSize:17, color:'#111', letterSpacing:'-0.5px' }}>NABTA</span>}
        </div>
        {!collapsed && (
          <div style={{ padding:'8px 18px 0', flexShrink:0 }}>
            <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:roleColor+'18', color:roleColor, fontWeight:700, textTransform:'capitalize' }}>
              {user?.role}
            </span>
          </div>
        )}
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto', overflowX:'hidden' }}>
          {menu.map(item => {
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:collapsed?'10px 0':'9px 12px', justifyContent:collapsed?'center':'flex-start', borderRadius:8, marginBottom:2, border:'none', textAlign:'left', background:active?roleColor+'15':'transparent', color:active?roleColor:'#555', fontWeight:active?700:400, fontSize:14, cursor:'pointer', fontFamily:'inherit', transition:'all 0.12s' }}
                title={collapsed?item.label:''}>
                <span style={{ fontSize:17, width:20, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {!collapsed && (
          <div style={{ padding:'10px 18px', borderTop:'1px solid #f0f0f0', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:roleColor+'20', color:roleColor, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11, flexShrink:0 }}>
                {initiales}
              </div>
              <div style={{ overflow:'hidden' }}>
                <p style={{ margin:0, fontSize:12, fontWeight:600, color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.nom}</p>
                <p style={{ margin:0, fontSize:11, color:'#aaa' }}>{user?.email}</p>
              </div>
            </div>
          </div>
        )}
        <div style={{ padding:'8px', borderTop:'1px solid #f0f0f0', flexShrink:0 }}>
          <button onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:collapsed?'10px 0':'9px 12px', justifyContent:collapsed?'center':'flex-start', borderRadius:8, border:'none', background:'transparent', color:'#ef4444', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}>
            <span style={{ fontSize:16, flexShrink:0 }}>↩</span>
            {!collapsed && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Topbar */}
        <header style={{ height:56, background:'#fff', borderBottom:'1px solid #eaecef', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'sticky', top:0, zIndex:40, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setCollapsed(p=>!p)}
              style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#9ca3af', padding:'4px 6px', borderRadius:6, lineHeight:1 }}>
              ☰
            </button>
            <span style={{ fontSize:14, color:'#6b7280', fontWeight:500 }}>
              {menu.find(m => isActive(m.path))?.label || 'Dashboard'}
            </span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:14 }}>

            {/* ── CLOCHE NOTIFICATIONS ── */}
            <div style={{ position:'relative' }} ref={notifRef}>
              <button
                onClick={() => { setShowNotifs(p=>!p); if (!showNotifs) marquerTousLus(); }}
                style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9ca3af', position:'relative', padding:'4px 6px' }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{ position:'absolute', top:0, right:0, width:18, height:18, background:'#ef4444', borderRadius:'50%', border:'2px solid #fff', fontSize:10, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Panneau notifications */}
              {showNotifs && (
                <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:340, background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:1000, overflow:'hidden' }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:700, fontSize:14, color:'#111' }}>🔔 Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={marquerTousLus} style={{ fontSize:11, color:'#16a34a', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>
                        Tout marquer lu
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight:360, overflowY:'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding:'32px 16px', textAlign:'center', color:'#aaa' }}>
                        <p style={{ fontSize:28, margin:'0 0 8px' }}>🔔</p>
                        <p style={{ fontSize:13, margin:0 }}>Aucune notification</p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} style={{ padding:'12px 16px', borderBottom:'1px solid #f9f9f9', background:n.lu?'#fff':'#f0f9ff', display:'flex', gap:10, alignItems:'flex-start' }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{iconNotif(n.type)}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:n.lu?400:600, color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {n.titre}
                          </p>
                          <p style={{ margin:'0 0 2px', fontSize:12, color:'#555' }}>{n.message}</p>
                          <p style={{ margin:0, fontSize:11, color:'#bbb' }}>
                            {new Date(n.at).toLocaleString('fr-FR', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' })}
                          </p>
                        </div>
                        {!n.lu && <div style={{ width:8, height:8, borderRadius:'50%', background:'#3b82f6', flexShrink:0, marginTop:4 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profil */}
            <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => navigate('/parametres')}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:roleColor+'20', border:`2px solid ${roleColor}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:roleColor, flexShrink:0 }}>
                {initiales}
              </div>
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:600, color:'#111', lineHeight:1.3 }}>{user?.nom}</p>
                <p style={{ margin:0, fontSize:11, color:'#9ca3af', textTransform:'capitalize' }}>{user?.role}</p>
              </div>
            </div>

          </div>
        </header>

        {/* Contenu */}
        <main style={{ flex:1, overflow:'auto', padding:'28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}