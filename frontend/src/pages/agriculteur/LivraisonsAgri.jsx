// frontend/src/pages/agriculteur/LivraisonsAgri.jsx
import { useState, useEffect } from 'react';
import { Card, Badge, Row, Col, Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';

const STATUTS = {
  en_attente: { label: 'En attente',  color: '#854f0b', bg: '#faeeda' },
  confirme:   { label: 'Confirmé',    color: '#185fa5', bg: '#e6f1fb' },
  en_cours:   { label: 'En cours',    color: '#0f6e56', bg: '#e1f5ee' },
  livre:      { label: 'Livré',       color: '#3b6d11', bg: '#eaf3de' },
  annule:     { label: 'Annulé',      color: '#a32d2d', bg: '#fcebeb' },
};

export default function LivraisonsAgri() {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [detail, setDetail]         = useState(null);

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    try {
      const { data } = await axios.get('/api/livraisons');
      setLivraisons(data.livraisons);
    } finally { setLoading(false); }
  };

  const stats = {
    total:     livraisons.length,
    en_cours:  livraisons.filter(l => l.statut === 'en_cours').length,
    livres:    livraisons.filter(l => l.statut === 'livre').length,
    en_attente:livraisons.filter(l => l.statut === 'en_attente').length,
  };

  return (
    <div>
      <h2 style={{ color: '#2d6a4f', fontWeight: 600, marginBottom: 24 }}> Mes Commandes</h2>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {[
          ['Total commandes', stats.total,      '#2d6a4f'],
          ['En cours',        stats.en_cours,   '#0f6e56'],
          ['Livrées',         stats.livres,     '#3b6d11'],
          ['En attente',      stats.en_attente, '#854f0b'],
        ].map(([label, val, color]) => (
          <Col xs={6} md={3} key={label}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
              <h3 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 700, color }}>{val}</h3>
            </div>
          </Col>
        ))}
      </Row>

      {/* Liste commandes */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-success"/></div>
      ) : livraisons.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p style={{ fontSize: 48 }}>=</p><p>Aucune commande pour l'instant.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {livraisons.map(liv => {
            const s = STATUTS[liv.statut] || STATUTS.en_attente;
            return (
              <Card key={liv._id} style={{ border: '1px solid #e9ecef', borderRadius: 12 }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <h6 style={{ fontWeight: 600, margin: '0 0 4px' }}>{liv.produit?.nom}</h6>
                      <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6c757d' }}>
                        Qté : {liv.quantite} · Total : <strong style={{ color: '#2d6a4f' }}>{liv.prixTotal} DT</strong>
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#adb5bd' }}>
                        📍 {liv.adresseLivraison} · {new Date(liv.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, backgroundColor: s.bg, color: s.color, fontWeight: 500 }}>
                        {s.label}
                      </span>
                      <Button size="sm" variant="outline-secondary" onClick={() => setDetail(liv)}>Détails</Button>
                    </div>
                  </div>
                  {/* Barre de progression */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      {['en_attente','confirme','en_cours','livre'].map((etape, i) => {
                        const etapes = ['en_attente','confirme','en_cours','livre'];
                        const idx    = etapes.indexOf(liv.statut);
                        const actif  = i <= idx;
                        return (
                          <div key={etape} style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%', margin: '0 auto 4px',
                              backgroundColor: actif ? '#2d6a4f' : '#dee2e6',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, color: actif ? '#fff' : '#adb5bd', fontWeight: 700
                            }}>{i + 1}</div>
                            <p style={{ margin: 0, fontSize: 10, color: actif ? '#2d6a4f' : '#adb5bd' }}>
                              {STATUTS[etape]?.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal détail */}
      <Modal show={!!detail} onHide={() => setDetail(null)} centered>
        <Modal.Header closeButton><Modal.Title> Détail commande</Modal.Title></Modal.Header>
        <Modal.Body>
          {detail && (
            <Table borderless size="sm">
              <tbody>
                {[
                  ['Produit',       detail.produit?.nom],
                  ['Quantité',      detail.quantite],
                  ['Prix total',    `${detail.prixTotal} DT`],
                  ['Adresse',       detail.adresseLivraison],
                  ['Date commande', new Date(detail.date).toLocaleDateString('fr-FR')],
                  ['Transporteur',  detail.transporteur?.nom || 'Non assigné'],
                  ['Statut',        STATUTS[detail.statut]?.label],
                ].map(([k, v]) => (
                  <tr key={k}><td style={{ color: '#6c757d', width: '40%' }}>{k}</td><td style={{ fontWeight: 500 }}>{v}</td></tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}