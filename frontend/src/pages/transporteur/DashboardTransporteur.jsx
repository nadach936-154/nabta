// frontend/src/pages/transporteur/DashboardTransporteur.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LIVRAISONS = [
  { id: '#L001', produit: 'Engrais Bio Premium',  from: 'Tunis',   to: 'Nabeul',  statut: 'en_cours',  total: '4 500 DT', date: '2026-04-02' },
  { id: '#L002', produit: "Semences de Blé",       from: 'Sfax',    to: 'Gafsa',   statut: 'en_attente',total: '2 100 DT', date: '2026-04-02' },
  { id: '#L003', produit: 'Système Irrigation',    from: 'Bizerte', to: 'Béja',    statut: 'livre',     total: '6 200 DT', date: '2026-04-01' },
  { id: '#L004', produit: 'Fertilisant Organique', from: 'Sousse',  to: 'Kairouan',statut: 'en_cours',  total: '1 800 DT', date: '2026-04-01' },
];

const STATUTS = {
  en_cours:   { label: 'En cours',   bg: '#dbeafe', color: '#2563eb', next: 'livre',     nextLabel: '✓ Marquer livré' },
  en_attente: { label: 'En attente', bg: '#fef9c3', color: '#b45309', next: 'en_cours',  nextLabel: '▶ Démarrer'     },
  livre:      { label: 'Livré ✓',   bg: '#dcfce7', color: '#16a34a', next: null,        nextLabel: null             },
};

export default function DashboardTransporteur() {
  const { user } = useAuth();
  const [livraisons, setLivraisons] = useState(LIVRAISONS);

  const avancer = (id) => {
    setLivraisons(prev => prev.map(l => {
      if (l.id !== id) return l;
      const nextStatut = STATUTS[l.statut]?.next;
      return nextStatut ? { ...l, statut: nextStatut } : l;
    }));
  };

  const enCours   = livraisons.filter(l => l.statut === 'en_cours').length;
  const enAttente = livraisons.filter(l => l.statut === 'en_attente').length;
  const livrees   = livraisons.filter(l => l.statut === 'livre').length;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#111' }}>
        Bonjour, {user?.nom?.split(' ')[0]} 🚚
      </h2>
      <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>Gérez vos livraisons et tournées</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Livraisons', val: livraisons.length, sub: 'Assignées',    icon: '📦', color: '#3b82f6' },
          { label: 'En Cours',         val: enCours,           sub: 'En route',     icon: '🚚', color: '#f97316' },
          { label: 'En Attente',       val: enAttente,         sub: 'À démarrer',   icon: '⏳', color: '#b45309' },
          { label: 'Livrées',          val: livrees,           sub: 'Terminées',    icon: '✅', color: '#16a34a' },
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

      {/* Livraisons du jour */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px' }}>
        <p style={{ margin: '0 0 16px', fontWeight: 600, fontSize: 14 }}>Mes Livraisons</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#888', fontSize: 12 }}>
              {['ID', 'Produit', 'Départ', 'Destination', 'Total', 'Date', 'Statut', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px 10px 0', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {livraisons.map(l => {
              const sc = STATUTS[l.statut];
              return (
                <tr key={l.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '11px 0', fontWeight: 600, color: '#888' }}>{l.id}</td>
                  <td style={{ padding: '11px 0', fontWeight: 500 }}>{l.produit}</td>
                  <td style={{ padding: '11px 0', color: '#888' }}>📍 {l.from}</td>
                  <td style={{ padding: '11px 0', color: '#888' }}>🏁 {l.to}</td>
                  <td style={{ padding: '11px 0', fontWeight: 600 }}>{l.total}</td>
                  <td style={{ padding: '11px 0', color: '#888' }}>{l.date}</td>
                  <td style={{ padding: '11px 0' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </td>
                  <td style={{ padding: '11px 0' }}>
                    {sc.next && (
                      <button onClick={() => avancer(l.id)} style={{
                        background: '#16a34a', color: '#fff', border: 'none',
                        borderRadius: 6, padding: '5px 12px', fontSize: 12,
                        cursor: 'pointer', fontWeight: 500,
                      }}>{sc.nextLabel}</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}