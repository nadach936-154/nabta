// frontend/src/pages/transporteur/MesLivraisons.jsx
import { useState, useEffect } from 'react';
import { Card, Badge, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const STATUTS_TRANSPORT = ['en_attente','confirme','en_cours','livre','annule'];
const STATUT_LABEL = {
  en_attente: 'En attente', confirme: 'Confirmé',
  en_cours: 'En cours', livre: 'Livré', annule: 'Annulé'
};
const STATUT_COULEUR = {
  en_attente: { bg: '#faeeda', color: '#854f0b' },
  confirme:   { bg: '#e6f1fb', color: '#185fa5' },
  en_cours:   { bg: '#e1f5ee', color: '#0f6e56' },
  livre:      { bg: '#eaf3de', color: '#3b6d11' },
  annule:     { bg: '#fcebeb', color: '#a32d2d' },
};

export default function MesLivraisons() {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [message, setMessage]       = useState(null);

  useEffect(() => { charger(); }, []);
  const charger = async () => {
    try { const { data } = await axios.get('/api/livraisons'); setLivraisons(data.livraisons); }
    finally { setLoading(false); }
  };

  const mettreAJourStatut = async (id, statut) => {
    try {
      await axios.put(`/api/livraisons/${id}/statut`, { statut });
      setMessage({ type: 'success', text: `Statut mis à jour : ${STATUT_LABEL[statut]}` });
      charger();
    } catch { setMessage({ type: 'danger', text: 'Erreur de mise à jour.' }); }
  };

  const stats = {
    total: livraisons.length,
    en_cours: livraisons.filter(l => l.statut === 'en_cours').length,
    livres: livraisons.filter(l => l.statut === 'livre').length,
  };

  return (
    <div>
      <h2 style={{ color: '#0f6e56', fontWeight: 600, marginBottom: 24 }}>🚚 Mes Livraisons</h2>
      {message && <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>{message.text}</Alert>}

      <Row className="g-3 mb-4">
        {[['Assignées', stats.total, '#0f6e56'], ['En cours', stats.en_cours, '#185fa5'], ['Terminées', stats.livres, '#3b6d11']].map(([l, v, c]) => (
          <Col xs={4} key={l}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#6c757d' }}>{l}</p>
              <h3 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 700, color: c }}>{v}</h3>
            </div>
          </Col>
        ))}
      </Row>

      {loading ? <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0f6e56' }}/></div>
      : livraisons.length === 0 ? <div className="text-center py-5 text-muted"><p style={{ fontSize: 48 }}>🚚</p><p>Aucune livraison assignée.</p></div>
      : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {livraisons.map(liv => {
            const s = STATUT_COULEUR[liv.statut];
            const prochainStatuts = STATUTS_TRANSPORT.filter(st => st !== liv.statut && st !== 'annule');
            return (
              <Card key={liv._id} style={{ border: '1px solid #e9ecef', borderRadius: 12 }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div style={{ flex: 1 }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h6 style={{ fontWeight: 600, margin: 0 }}>{liv.produit?.nom}</h6>
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, backgroundColor: s?.bg, color: s?.color, fontWeight: 500 }}>
                          {STATUT_LABEL[liv.statut]}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 3px', fontSize: 13, color: '#6c757d' }}>
                        👤 Acheteur : {liv.acheteur?.nom}
                      </p>
                      <p style={{ margin: '0 0 3px', fontSize: 13, color: '#6c757d' }}>
                        📍 {liv.adresseLivraison}
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: '#2d6a4f', fontWeight: 500 }}>
                        💰 {liv.prixTotal} DT · Qté : {liv.quantite}
                      </p>
                    </div>
                    {/* Sélecteur statut */}
                    <div style={{ minWidth: 200 }}>
                      <Form.Label style={{ fontSize: 12, color: '#6c757d', marginBottom: 4 }}>Mettre à jour le statut</Form.Label>
                      <Form.Select
                        size="sm"
                        value={liv.statut}
                        onChange={e => mettreAJourStatut(liv._id, e.target.value)}
                        style={{ borderRadius: 8 }}
                      >
                        {STATUTS_TRANSPORT.map(st => (
                          <option key={st} value={st}>{STATUT_LABEL[st]}</option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}