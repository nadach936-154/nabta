// frontend/src/pages/veterinaire/DashboardVeterinaire.jsx
import { useAuth } from '../../context/AuthContext';

const RAPPORTS = [
  { animal: 'Vache laitière',    ferme: 'Ferme El Baraka', diag: 'Fièvre aphteuse',   statut: 'urgence',  date: '2026-04-01' },
  { animal: 'Troupeau moutons',  ferme: 'Ahmed Bennani',   diag: 'Contrôle vaccinal', statut: 'normal',   date: '2026-03-30' },
  { animal: 'Poulets de chair',  ferme: 'Ferme Nabeul',    diag: 'Bronchite infect.', statut: 'suivi',    date: '2026-03-29' },
  { animal: 'Chèvres',          ferme: 'Sidi Bouzid',     diag: 'Parasitose',        statut: 'traitement',date:'2026-03-28'},
];

const StatutBadge = ({ s }) => {
  const cfg = {
    urgence:    { label: '⚠ Urgence',    bg: '#fee2e2', color: '#dc2626' },
    normal:     { label: '✓ Normal',     bg: '#dcfce7', color: '#16a34a' },
    suivi:      { label: '● Suivi',      bg: '#fef9c3', color: '#b45309' },
    traitement: { label: '💊 Traitement',bg: '#dbeafe', color: '#2563eb' },
  }[s] || { label: s, bg: '#f3f4f6', color: '#888' };
  return <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
};

export default function DashboardVeterinaire() {
  const { user } = useAuth();
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#111' }}>
        Bonjour Dr. {user?.nom?.split(' ')[0]}
      </h2>
      <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>Gérez vos rapports et interventions vétérinaires</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Rapports Total',   val: '24',  sub: 'Ce mois',        icon: '📋', color: '#3b82f6' },
          { label: 'Cas Urgents',      val: '2',   sub: 'À traiter',      icon: '🚨', color: '#dc2626' },
          { label: 'Interventions',    val: '8',   sub: 'Cette semaine',  icon: '🐄', color: '#16a34a' },
          { label: 'Patients suivis',  val: '47',  sub: '+5 ce mois',     icon: '🏥', color: '#a855f7' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#888' }}>{s.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: s.color }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{s.sub}</p>
            </div>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Alerte urgence */}
      <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>🚨</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#dc2626' }}>2 cas urgents nécessitent votre attention</p>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#888' }}>Fièvre aphteuse — Ferme El Baraka · Voir les détails</p>
        </div>
        <button style={{ marginLeft: 'auto', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
          Traiter maintenant
        </button>
      </div>

      {/* Actions */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 14 }}>Actions Rapides</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {['+ Nouveau Rapport', '📋 Mes Rapports', '🔍 Annuaire', '📞 Contacts'].map((a, i) => (
            <button key={a} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: i === 0 ? '#16a34a' : '#fff', color: i === 0 ? '#fff' : '#374151',
              border: i === 0 ? 'none' : '1px solid #e8e8e8',
            }}>{a}</button>
          ))}
        </div>
      </div>

      {/* Rapports récents */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Rapports Récents</p>
          <span style={{ fontSize: 12, color: '#16a34a', cursor: 'pointer' }}>Voir tout</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#888', fontSize: 12 }}>
              {['Animal', 'Élevage', 'Diagnostic', 'Date', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 0', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RAPPORTS.map(r => (
              <tr key={r.animal + r.date} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '10px 0', fontWeight: 500 }}>🐾 {r.animal}</td>
                <td style={{ padding: '10px 0', color: '#888' }}>{r.ferme}</td>
                <td style={{ padding: '10px 0' }}>{r.diag}</td>
                <td style={{ padding: '10px 0', color: '#888' }}>{r.date}</td>
                <td style={{ padding: '10px 0' }}><StatutBadge s={r.statut} /></td>
                <td style={{ padding: '10px 0' }}>
                  <button style={{ fontSize: 12, color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}