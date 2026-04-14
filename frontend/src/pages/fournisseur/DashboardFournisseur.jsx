// frontend/src/pages/fournisseur/DashboardFournisseur.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const PRODUITS = [
  { nom: 'Engrais Bio Premium',   cat: 'Engrais',    prix: '450 DT', qte: 150, statut: 'stock' },
  { nom: 'Semences de Blé',       cat: 'Semences',   prix: '320 DT', qte: 45,  statut: 'bas'   },
  { nom: 'Pesticide Naturel',     cat: 'Protection', prix: '280 DT', qte: 0,   statut: 'rupture'},
];
const COMMANDES = [
  { id: '#1', produit: 'Engrais Bio Premium',  client: 'Ahmed Bennani',   qte: 10, total: '4 500 DT', date: '2026-02-28', statut: 'attente'    },
  { id: '#2', produit: "Système d'Irrigation", client: 'Mohammed Tazi',   qte: 2,  total: '2 400 DT', date: '2026-02-27', statut: 'traitement' },
  { id: '#3', produit: 'Semences de Blé',      client: 'Hassan El Fassi', qte: 25, total: '8 000 DT', date: '2026-02-26', statut: 'expediee'   },
];

const StatutBadge = ({ s }) => {
  const cfg = {
    stock:      { label: 'En stock',    bg: '#dcfce7', color: '#16a34a' },
    bas:        { label: 'Stock bas',   bg: '#fef9c3', color: '#b45309' },
    rupture:    { label: 'Rupture',     bg: '#fee2e2', color: '#dc2626' },
    attente:    { label: 'En attente',  bg: '#fef9c3', color: '#b45309' },
    traitement: { label: 'En traitement',bg:'#dbeafe', color: '#2563eb' },
    expediee:   { label: 'Expédiée',    bg: '#ede9fe', color: '#7c3aed' },
    livree:     { label: 'Livrée',      bg: '#dcfce7', color: '#16a34a' },
  }[s] || { label: s, bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 600,
      background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
};

export default function DashboardFournisseur() {
  const { user } = useAuth();

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#111' }}>
        Bienvenue, {user?.nom?.split(' ')[0]} !
      </h2>
      <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>Gérez vos produits et commandes</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Produits',       val: '48',   sub: '+4 ce mois',   icon: '📦', ic: '#3b82f6' },
          { label: 'Niveau de Stock',      val: '85%',  sub: '3 produits bas', icon: '📊', ic: '#a855f7' },
          { label: 'Commandes en Attente', val: '12',   sub: 'À traiter',    icon: '🛒', ic: '#f97316' },
          { label: 'Revenu (DT)',          val: '156K', sub: '+22% ce mois', icon: '💰', ic: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#888' }}>{s.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#111' }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#22c55e' }}>{s.sub}</p>
            </div>
            <span style={{ fontSize: 22, opacity: 0.7 }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 14 }}>Actions Rapides</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: '+ Ajouter Produit', bg: '#16a34a', color: '#fff' },
            { label: '🛒 Voir Commandes', bg: '#fff',    color: '#374151', border: '1px solid #e8e8e8' },
            { label: '↗ Rapports',        bg: '#fff',    color: '#374151', border: '1px solid #e8e8e8' },
            { label: '⚠ Alertes Stock',   bg: '#fff',    color: '#374151', border: '1px solid #e8e8e8' },
          ].map(a => (
            <button key={a.label} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: a.bg, color: a.color, border: a.border || 'none', cursor: 'pointer',
            }}>{a.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Produits récents */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Produits Récents</p>
            <span style={{ fontSize: 12, color: '#16a34a', cursor: 'pointer' }}>Voir tout</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: '#888', fontSize: 12 }}>
                {['Nom', 'Catégorie', 'Prix', 'Quantité', 'Statut'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 0', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUITS.map(p => (
                <tr key={p.nom} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '10px 0', fontWeight: 500 }}>{p.nom}</td>
                  <td style={{ padding: '10px 0', color: '#888' }}>{p.cat}</td>
                  <td style={{ padding: '10px 0' }}>{p.prix}</td>
                  <td style={{ padding: '10px 0' }}>{p.qte}</td>
                  <td style={{ padding: '10px 0' }}><StatutBadge s={p.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Commandes récentes */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Commandes Récentes</p>
            <span style={{ fontSize: 12, color: '#16a34a', cursor: 'pointer' }}>Voir tout</span>
          </div>
          {COMMANDES.map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid #f9f9f9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛒</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{c.produit}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#888' }}>{c.client} · {c.qte} unités</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{c.total}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#888' }}>{c.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}