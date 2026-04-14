// frontend/src/components/RechercheGlobale.jsx
// Composant de recherche utilisable dans la Navbar / Layout
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RechercheGlobale() {
  const [query, setQuery]       = useState('');
  const [resultats, setResultats] = useState({ produits: [], professionnels: [] });
  const [loading, setLoading]   = useState(false);
  const [ouvert, setOuvert]     = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Fermer si clic à l'extérieur
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOuvert(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    if (query.length < 2) { setResultats({ produits: [], professionnels: [] }); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [p, pro] = await Promise.all([
          axios.get(`/api/produits?search=${query}`),
          axios.get(`/api/users/annuaire?search=${query}`),
        ]);
        setResultats({ produits: p.data.produits.slice(0, 4), professionnels: pro.data.professionnels.slice(0, 3) });
        setOuvert(true);
      } finally { setLoading(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const aller = (path) => { navigate(path); setQuery(''); setOuvert(false); };

  const total = resultats.produits.length + resultats.professionnels.length;

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 10, padding: '7px 14px' }}>
        <span style={{ fontSize: 14 }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher produits, professionnels..."
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: '#212529' }}
        />
        {loading && <div style={{ width: 14, height: 14, border: '2px solid #dee2e6', borderTopColor: '#1a3a2a', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />}
      </div>

      {ouvert && query.length >= 2 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 1000, overflow: 'hidden' }}>
          {total === 0 ? (
            <p style={{ padding: '16px', textAlign: 'center', color: '#6c757d', fontSize: 14, margin: 0 }}>
              Aucun résultat pour « {query} »
            </p>
          ) : (
            <>
              {resultats.produits.length > 0 && (
                <div>
                  <div style={{ padding: '8px 16px', background: '#f8f9fa', fontSize: 11, fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📦 Produits ({resultats.produits.length})
                  </div>
                  {resultats.produits.map(p => (
                    <div key={p._id} onClick={() => aller('/produits')}
                      style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8f9fa', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{p.nom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#6c757d' }}>{p.categorie} · {p.fournisseur?.nom}</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a' }}>{p.prix} DT</span>
                    </div>
                  ))}
                </div>
              )}
              {resultats.professionnels.length > 0 && (
                <div>
                  <div style={{ padding: '8px 16px', background: '#f8f9fa', fontSize: 11, fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    👥 Professionnels ({resultats.professionnels.length})
                  </div>
                  {resultats.professionnels.map(p => (
                    <div key={p._id} onClick={() => aller('/annuaire')}
                      style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{p.nom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#6c757d' }}>{p.role} · {p.adresse || 'Tunisie'}</p>
                      </div>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#e1f5ee', color: '#0f6e56' }}>{p.role}</span>
                    </div>
                  ))}
                </div>
              )}
              <div onClick={() => aller(`/produits?search=${query}`)}
                style={{ padding: '10px 16px', textAlign: 'center', cursor: 'pointer', borderTop: '1px solid #e9ecef', fontSize: 13, color: '#1a3a2a', fontWeight: 600 }}>
                Voir tous les résultats pour « {query} » →
              </div>
            </>
          )}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}