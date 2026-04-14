// src/components/Layout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENUS = {
  agriculteur: [
    { path:'/dashboard',        icon:'⊞', label:'Dashboard'     },
    { path:'/mes-cultures',     icon:'🌾', label:'Mes Cultures'   },
    { path:'/marketplace',      icon:'🛒', label:'Marketplace'    }, 
    { path:'/livraison',        icon:'📦', label:'Livraison'      },
    { path:'/contacts',         icon:'📞', label:'Contacts'       }, 
    { path:'/assistant',        icon:'🤖', label:'Assistant IA'   },
  ],
  fournisseur: [
    { path:'/dashboard',        icon:'⊞', label:'Dashboard'     },
    { path:'/marketplace-four', icon:'🛒', label:'Marketplace' },
    { path:'/commandes',        icon:'🛒', label:'Commandes'      },
    { path:'/stock',            icon:'📊', label:'Stock'          },
    { path:'/assistant',        icon:'🤖', label:'Assistant IA'   },
  ],
  veterinaire: [
    { path:'/dashboard',        icon:'⊞', label:'Dashboard'        },
    { path:'/consultations',    icon:'📅', label:'Consultations'    },
    { path:'/rapports',         icon:'📋', label:'Rapports médicaux'},
    { path:'/historique-vet',   icon:'🕐', label:'Historique'       },
    { path:'/assistant',        icon:'🤖', label:'Assistant IA'     },
  ],
  transporteur: [
    { path:'/dashboard',        icon:'⊞', label:'Dashboard'    },
    { path:'/livraisons',       icon:'🚚', label:'Livraisons'   },
    { path:'/demandes',         icon:'📬', label:'Demandes'     },
    { path:'/historique-trans', icon:'🕐', label:'Historique'   },
    { path:'/assistant',        icon:'🤖', label:'Assistant IA' },
  ],
  admin: [
    { path:'/dashboard',        icon:'⊞', label:'Dashboard'    },
    { path:'/admin',            icon:'👥', label:'Utilisateurs'  },
    { path:'/produits',         icon:'📦', label:'Produits'      },
    { path:'/statistiques',     icon:'📈', label:'Statistiques'  },
  ],
};

const ROLE_COLOR = {
  agriculteur:  '#16a34a',
  fournisseur:  '#b45309',
  veterinaire:  '#2563eb',
  transporteur: '#7c3aed',
  admin:        '#dc2626',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu      = MENUS[user?.role] || [];
  const roleColor = ROLE_COLOR[user?.role] || '#16a34a';
  const initiales = user?.nom?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '??';
  const isActive  = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f7f8fa', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width:      collapsed ? 60 : 220,
        background: '#fff',
        borderRight:'1px solid #eaecef',
        display:    'flex', flexDirection:'column',
        flexShrink: 0,
        position:   'sticky', top:0, height:'100vh',
        transition: 'width 0.2s ease',
        overflow:   'hidden', zIndex:50,
        boxShadow:  '2px 0 8px rgba(0,0,0,0.04)',
      }}>
        {/* Logo */}
        <div style={{ padding:collapsed?'16px 0':'16px 18px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:10, justifyContent:collapsed?'center':'flex-start', minHeight:60, flexShrink:0 }}>
          <span style={{ fontSize:22, color:'#16a34a', flexShrink:0 }}>🌿</span>
          {!collapsed && <span style={{ fontWeight:800, fontSize:17, color:'#111', letterSpacing:'-0.5px' }}>NABTA</span>}
        </div>

        {/* Badge rôle */}
        {!collapsed && (
          <div style={{ padding:'8px 18px 0', flexShrink:0 }}>
            <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:roleColor+'18', color:roleColor, fontWeight:700, textTransform:'capitalize' }}>
              {user?.role}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto', overflowX:'hidden' }}>
          {menu.map(item => {
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:collapsed?'10px 0':'9px 12px', justifyContent:collapsed?'center':'flex-start', borderRadius:8, marginBottom:2, border:'none', textAlign:'left', background:active?roleColor+'15':'transparent', color:active?roleColor:'#555', fontWeight:active?700:400, fontSize:14, cursor:'pointer', fontFamily:'inherit', transition:'all 0.12s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background='#f4f5f7'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background='transparent'; }}
                title={collapsed ? item.label : ''}
              >
                <span style={{ fontSize:17, width:20, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Profil */}
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

        {/* Déconnexion */}
        <div style={{ padding:'8px', borderTop:'1px solid #f0f0f0', flexShrink:0 }}>
          <button onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:collapsed?'10px 0':'9px 12px', justifyContent:collapsed?'center':'flex-start', borderRadius:8, border:'none', background:'transparent', color:'#ef4444', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}
            onMouseEnter={e => { e.currentTarget.style.background='#fff5f5'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
          >
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
            <button onClick={() => setCollapsed(p => !p)}
              style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#9ca3af', padding:'4px 6px', borderRadius:6, lineHeight:1 }}>
              ☰
            </button>
            <span style={{ fontSize:14, color:'#6b7280', fontWeight:500 }}>
              {menu.find(m => isActive(m.path))?.label || 'Dashboard'}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button style={{ background:'none', border:'none', fontSize:17, cursor:'pointer', color:'#9ca3af', position:'relative' }}>
              🔔
              <span style={{ position:'absolute', top:-2, right:-2, width:8, height:8, background:'#ef4444', borderRadius:'50%', border:'2px solid #fff' }} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
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