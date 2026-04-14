// src/components/UI.jsx — composants réutilisables

export const StatCard = ({ label, value, sub, icon, color = '#16a34a' }) => (
  <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, padding:'18px 20px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
    <div>
      <p style={{ margin:'0 0 6px', fontSize:12, color:'#888', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</p>
      <p style={{ margin:'0 0 4px', fontSize:26, fontWeight:700, color }}>{value}</p>
      {sub && <p style={{ margin:0, fontSize:12, color:'#16a34a' }}>{sub}</p>}
    </div>
    {icon && <span style={{ fontSize:24, opacity:0.7 }}>{icon}</span>}
  </div>
);

export const Badge = ({ statut }) => {
  const cfg = {
    stock:       { label:'En stock',     bg:'#dcfce7', color:'#16a34a' },
    bas:         { label:'Stock bas',    bg:'#fef9c3', color:'#b45309' },
    rupture:     { label:'Rupture',      bg:'#fee2e2', color:'#dc2626' },
    attente:     { label:'En attente',   bg:'#fef9c3', color:'#b45309' },
    traitement:  { label:'En traitement',bg:'#dbeafe', color:'#2563eb' },
    expediee:    { label:'Expédiée',     bg:'#ede9fe', color:'#7c3aed' },
    livree:      { label:'Livrée ✓',    bg:'#dcfce7', color:'#16a34a' },
    livre:       { label:'Livré ✓',     bg:'#dcfce7', color:'#16a34a' },
    en_cours:    { label:'En cours',     bg:'#dbeafe', color:'#2563eb' },
    en_attente:  { label:'En attente',   bg:'#fef9c3', color:'#b45309' },
    confirme:    { label:'Confirmé',     bg:'#dcfce7', color:'#16a34a' },
    urgence:     { label:'⚠ Urgence',   bg:'#fee2e2', color:'#dc2626' },
    normal:      { label:'✓ Normal',    bg:'#dcfce7', color:'#16a34a' },
    suivi:       { label:'Suivi',        bg:'#fef9c3', color:'#b45309' },
    traitement2: { label:'Traitement',   bg:'#dbeafe', color:'#2563eb' },
    croissance:  { label:'En croissance',bg:'#dcfce7', color:'#16a34a' },
    floraison:   { label:'Floraison',    bg:'#dbeafe', color:'#2563eb' },
    repos:       { label:'Repos',        bg:'#f3f4f6', color:'#6b7280' },
    plantation:  { label:'Plantation',   bg:'#fef9c3', color:'#b45309' },
    recolte:     { label:'Récolte',      bg:'#ede9fe', color:'#7c3aed' },
    confirmee:   { label:'Confirmée',    bg:'#dcfce7', color:'#16a34a' },
    actif:       { label:'● Actif',     bg:'#dcfce7', color:'#16a34a' },
    inactif:     { label:'○ Inactif',   bg:'#fee2e2', color:'#dc2626' },
  }[statut] || { label: statut, bg:'#f3f4f6', color:'#6b7280' };
  return (
    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600, background:cfg.bg, color:cfg.color, whiteSpace:'nowrap' }}>
      {cfg.label}
    </span>
  );
};

export const Btn = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, style: extra = {} }) => {
  const base = { border:'none', borderRadius:8, fontWeight:600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily:'inherit', transition:'opacity 0.15s', opacity: disabled ? 0.6 : 1 };
  const variants = {
    primary:  { background:'#16a34a', color:'#fff' },
    secondary:{ background:'#fff',    color:'#374151', border:'1px solid #e8e8e8' },
    danger:   { background:'#fee2e2', color:'#dc2626' },
    ghost:    { background:'transparent', color:'#16a34a' },
  };
  const sizes = { sm:{ padding:'5px 12px', fontSize:12 }, md:{ padding:'8px 16px', fontSize:13 }, lg:{ padding:'11px 22px', fontSize:14 } };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...sizes[size], ...extra }}>{children}</button>;
};

export const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false, disabled = false }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</label>}
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      required={required} disabled={disabled}
      style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'9px 12px', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit', background: disabled ? '#f9fafb' : '#fff', color:'#111' }}
    />
  </div>
);

export const Card = ({ children, style: extra = {} }) => (
  <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, padding:'20px 22px', ...extra }}>
    {children}
  </div>
);

export const SectionTitle = ({ children, action }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
    <p style={{ margin:0, fontWeight:700, fontSize:15, color:'#111' }}>{children}</p>
    {action}
  </div>
);

export const EmptyState = ({ icon = '📭', title = 'Aucune donnée', desc = '' }) => (
  <div style={{ textAlign:'center', padding:'48px 24px', color:'#888' }}>
    <p style={{ fontSize:40, margin:'0 0 12px' }}>{icon}</p>
    <p style={{ fontWeight:600, fontSize:15, margin:'0 0 4px', color:'#555' }}>{title}</p>
    {desc && <p style={{ fontSize:13, margin:0 }}>{desc}</p>}
  </div>
);

export const Table = ({ headers, rows }) => (
  <div style={{ overflowX:'auto' }}>
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={{ textAlign:'left', padding:'8px 0 10px', fontWeight:600, fontSize:11, color:'#888', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'1px solid #f0f0f0' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  </div>
);

export const LoadingSpinner = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
    <div style={{ width:32, height:32, border:'3px solid #e8e8e8', borderTopColor:'#16a34a', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 4px', color:'#111' }}>{title}</h2>
      {subtitle && <p style={{ color:'#888', margin:0, fontSize:14 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);