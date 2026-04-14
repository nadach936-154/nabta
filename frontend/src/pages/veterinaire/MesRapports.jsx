// frontend/src/pages/veterinaire/MesRapports.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const RAPPORT_VIDE = { animal: '', description: '', diagnostic: '', traitement: '', urgence: false, agriculteur: '' };

export default function MesRapports() {
  const [rapports, setRapports]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(RAPPORT_VIDE);
  const [message, setMessage]     = useState(null);

  useEffect(() => { charger(); }, []);
  const charger = async () => {
    try { const { data } = await axios.get('/api/rapports'); setRapports(data.rapports); }
    finally { setLoading(false); }
  };

  const sauvegarder = async () => {
    try {
      await axios.post('/api/rapports', form);
      setMessage({ type: 'success', text: 'Rapport créé avec succès.' });
      setShowModal(false);
      setForm(RAPPORT_VIDE);
      charger();
    } catch (err) { setMessage({ type: 'danger', text: err.response?.data?.message || 'Erreur.' }); }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce rapport ?')) return;
    await axios.delete(`/api/rapports/${id}`);
    charger();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#185fa5', fontWeight: 600, margin: 0 }}>🐄 Mes Rapports Vétérinaires</h2>
        <Button style={{ backgroundColor: '#185fa5', border: 'none' }} onClick={() => setShowModal(true)}>
          <FiPlus className="me-1" /> Nouveau rapport
        </Button>
      </div>

      {message && <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>{message.text}</Alert>}

      <Row className="g-3 mb-4">
        {[['Total', rapports.length, '#185fa5'], ['Urgences', rapports.filter(r=>r.urgence).length, '#a32d2d'], ['Ce mois', rapports.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length, '#0f6e56']].map(([l,v,c]) => (
          <Col xs={4} key={l}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#6c757d' }}>{l}</p>
              <h3 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 700, color: c }}>{v}</h3>
            </div>
          </Col>
        ))}
      </Row>

      {loading ? <div className="text-center py-5"><div className="spinner-border" style={{ color: '#185fa5' }}/></div>
      : rapports.length === 0 ? <div className="text-center py-5 text-muted"><p style={{ fontSize: 48 }}>📋</p><p>Aucun rapport créé.</p></div>
      : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rapports.map(r => (
            <Card key={r._id} style={{ border: `1px solid ${r.urgence ? '#f0b9b9' : '#e9ecef'}`, borderRadius: 12, backgroundColor: r.urgence ? '#fff8f8' : '#fff' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 style={{ fontWeight: 600, margin: 0 }}>🐾 {r.animal}</h6>
                      {r.urgence && <Badge bg="danger" style={{ fontSize: 11 }}><FiAlertCircle className="me-1"/>URGENCE</Badge>}
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6c757d' }}>{r.description}</p>
                    {r.diagnostic && <p style={{ margin: '0 0 2px', fontSize: 13 }}>🔍 <strong>Diagnostic :</strong> {r.diagnostic}</p>}
                    {r.traitement && <p style={{ margin: '0 0 2px', fontSize: 13 }}>💊 <strong>Traitement :</strong> {r.traitement}</p>}
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: '#adb5bd' }}>
                      {new Date(r.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}
                    </p>
                  </div>
                  <Button size="sm" variant="outline-danger" onClick={() => supprimer(r._id)}><FiTrash2/></Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>📋 Nouveau rapport vétérinaire</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}><Form.Group><Form.Label>Animal / Espèce</Form.Label><Form.Control value={form.animal} onChange={e=>setForm({...form,animal:e.target.value})} placeholder="Ex: Vache, Mouton..." required/></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>ID Agriculteur (optionnel)</Form.Label><Form.Control value={form.agriculteur} onChange={e=>setForm({...form,agriculteur:e.target.value})} placeholder="ID de l'agriculteur"/></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label>Description des symptômes</Form.Label><Form.Control as="textarea" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Diagnostic</Form.Label><Form.Control value={form.diagnostic} onChange={e=>setForm({...form,diagnostic:e.target.value})}/></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Traitement prescrit</Form.Label><Form.Control value={form.traitement} onChange={e=>setForm({...form,traitement:e.target.value})}/></Form.Group></Col>
              <Col md={12}>
                <Form.Check type="switch" id="urgence-switch" label="⚠️ Marquer comme URGENCE"
                  checked={form.urgence} onChange={e=>setForm({...form,urgence:e.target.checked})}
                  style={{ color: form.urgence ? '#a32d2d' : 'inherit', fontWeight: form.urgence ? 600 : 400 }}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button style={{ backgroundColor: '#185fa5', border: 'none' }} onClick={sauvegarder}>Créer le rapport</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}