// frontend/src/pages/agriculteur/DashboardAgriculteur.jsx
import { useAuth } from '../../context/AuthContext';

const CULTURES = [
  { nom: 'Blé Dur',    surface: '12 ha', statut: 'croissance', recolte: 'Avr 2026' },
  { nom: 'Tomates',    surface: '5 ha',  statut: 'floraison',  recolte: 'Mar 2026' },
  { nom: 'Oliviers',   surface: '20 ha', statut: 'repos',      recolte: 'Oct 2026' },
  { nom: 'Pommes de Terre', surface:'8 ha', statut:'plantation', recolte:'Mai 2026'},
];
const ACTIVITES = [
  { action: 'Irrigation effectuée',       culture: 'Blé Dur',  heure: '08:30', icon: '💧' },
  { action: 'Traitement phytosanitaire',  culture: 'Tomates',  heure: '10:15', icon: '🌿' },
  { action: 'Récolte partielle',          culture: 'Oliviers', heure: 'Hier',  icon: '🫒' },
];

const StatutBadge = ({ s }) => {
  const cfg = {
    croissance: { label: 'En croissance', bg: '#dcfce7', color: '#16a34a' },
    floraison:  { label: 'Floraison',     bg: '#dbeafe', color: '#2563eb' },
    repos:      { label: 'Repos',         bg: '#f3f4f6', color: '#6b7280' },
    plantation: { label: 'Plantation',    bg: '#fef9c3', color: '#b45309' },
    recolte:    { label: 'Récolte',       bg: '#ede9fe', color: '#7c3aed' },
  }[s] || { label: s, bg: '#f3f4f6', color: '#6b7280' };
  return <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
};

export default function DashboardAgriculteur() {
  const { user } = useAuth();
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#111' }}>
        Bonjour, {user?.nom?.split(' ')[0]} 👋
      </h2>
      <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>Gérez vos cultures et activités agricoles</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Cultures Actives', val: '4',     sub: '45 ha total',    icon: '🌾', ic: '#22c55e' },
          { label: 'Prochaine Récolte',val: '18j',   sub: 'Tomates',        icon: '📅', ic: '#3b82f6' },
          { label: 'Commandes',        val: '3',     sub: 'En cours',       icon: '📦', ic: '#f97316' },
          { label: 'Revenu (DT)',      val: '12.4K', sub: 'Ce trimestre',   icon: '💰', ic: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#888' }}>{s.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#111' }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#16a34a' }}>{s.sub}</p>
            </div>
            <span style={{ fontSize: 22, opacity: 0.7 }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 14 }}>Actions Rapides</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {['+ Nouvelle Culture', '🛒 Marketplace', '🤖 Assistant IA', '📋 Annuaire'].map((a, i) => (
            <button key={a} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: i === 0 ? '#16a34a' : '#fff', color: i === 0 ? '#fff' : '#374151',
              border: i === 0 ? 'none' : '1px solid #e8e8e8',
            }}>{a}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        {/* Mes Cultures */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Mes Cultures</p>
            <span style={{ fontSize: 12, color: '#16a34a', cursor: 'pointer' }}>Voir tout</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: '#888', fontSize: 12 }}>
                {['Culture', 'Surface', 'Statut', 'Récolte prévue'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 0', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CULTURES.map(c => (
                <tr key={c.nom} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '10px 0', fontWeight: 500 }}>{c.nom}</td>
                  <td style={{ padding: '10px 0', color: '#888' }}>{c.surface}</td>
                  <td style={{ padding: '10px 0' }}><StatutBadge s={c.statut} /></td>
                  <td style={{ padding: '10px 0', color: '#888' }}>{c.recolte}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activités récentes */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px' }}>
          <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 14 }}>Activités Récentes</p>
          {ACTIVITES.map(a => (
            <div key={a.action} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f9f9f9' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{a.action}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#888' }}>{a.culture} · {a.heure}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}