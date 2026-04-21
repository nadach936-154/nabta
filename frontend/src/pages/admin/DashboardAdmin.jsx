// frontend/src/pages/admin/DashboardAdmin.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const USERS = [
  { id: 1, nom: 'Ahmed Bennani',  email: 'ahmed@test.tn',   role: 'agriculteur',  actif: true,  date: '2026-03-01' },
  { id: 2, nom: 'Fatima Zahra',   email: 'fatima@test.tn',  role: 'fournisseur',  actif: true,  date: '2026-03-05' },
  { id: 3, nom: 'Dr. Karim M.',   email: 'karim@test.tn',   role: 'veterinaire',  actif: true,  date: '2026-03-10' },
  { id: 4, nom: 'Nour Zouari',    email: 'nour@test.tn',    role: 'transporteur', actif: false, date: '2026-03-15' },
  { id: 5, nom: 'Sara Belhadj',   email: 'sara@test.tn',    role: 'fournisseur',  actif: true,  date: '2026-03-20' },
];
const ROLE_COLORS = {
  admin:        { bg: '#fee2e2', color: '#dc2626' },
  agriculteur:  { bg: '#dcfce7', color: '#16a34a' },
  fournisseur:  { bg: '#fef9c3', color: '#b45309' },
  veterinaire:  { bg: '#dbeafe', color: '#2563eb' },
  transporteur: { bg: '#f3e8ff', color: '#7c3aed' },
};

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState('');

  const toggle = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, actif: !u.actif } : u));

  const filtres = users.filter(u =>
    (u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filtre || u.role === filtre)
  );

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#111' }}>
        Administration NABTA — Bienvenue {user?.nom || 'Admin'}!
      </h2>
      <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>Supervision globale de la plateforme</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Utilisateurs',  val: users.length,                                  color: '#3b82f6' },
          { label: 'Agriculteurs',  val: users.filter(u=>u.role==='agriculteur').length, color: '#16a34a' },
          { label: 'Fournisseurs',  val: users.filter(u=>u.role==='fournisseur').length, color: '#b45309' },
          { label: 'Vétérinaires',  val: users.filter(u=>u.role==='veterinaire').length, color: '#2563eb' },
          { label: 'Inactifs',      val: users.filter(u=>!u.actif).length,               color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: '#888' }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tableau utilisateurs */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Gestion des Utilisateurs</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none', width: 200 }}
            />
            <select value={filtre} onChange={e => setFiltre(e.target.value)}
              style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none' }}>
              <option value="">Tous les rôles</option>
              {['agriculteur','fournisseur','veterinaire','transporteur','admin'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#888', fontSize: 12 }}>
              {['Utilisateur', 'Email', 'Rôle', 'Inscription', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 0 10px', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtres.map(u => {
              const rc = ROLE_COLORS[u.role] || { bg: '#f3f4f6', color: '#888' };
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '11px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: rc.bg, color: rc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                        {u.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 0', color: '#888' }}>{u.email}</td>
                  <td style={{ padding: '11px 0' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: rc.bg, color: rc.color }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '11px 0', color: '#888' }}>{u.date}</td>
                  <td style={{ padding: '11px 0' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                      background: u.actif ? '#dcfce7' : '#fee2e2',
                      color: u.actif ? '#16a34a' : '#dc2626',
                    }}>{u.actif ? '● Actif' : '○ Inactif'}</span>
                  </td>
                  <td style={{ padding: '11px 0' }}>
                    <button onClick={() => toggle(u.id)} style={{
                      fontSize: 12, padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                      background: u.actif ? '#fee2e2' : '#dcfce7',
                      color: u.actif ? '#dc2626' : '#16a34a',
                      border: 'none',
                    }}>{u.actif ? 'Désactiver' : 'Activer'}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#888' }}>{filtres.length} utilisateur(s) affiché(s)</p>
      </div>
    </div>
  );
}