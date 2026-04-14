// src/pages/agriculteur/Contacts.jsx
// Affiche les utilisateurs du localStorage (inscrits récemment) + mockés
import { useState, useEffect } from 'react';
import { useAuth, usersStore } from '../../context/AuthContext';
import { rdvStore } from '../../store/notifications';

const FILTRES = [
  { val:'tous',         label:'Tous',         icon:'👥' },
  { val:'veterinaire',  label:'Vétérinaires', icon:'🐄' },
  { val:'fournisseur',  label:'Fournisseurs', icon:'🏪' },
  { val:'transporteur', label:'Transporteurs',icon:'🚚' },
];
const RC = {
  veterinaire:  { bg:'#eff6ff', c:'#2563eb', b:'#bfdbfe' },
  fournisseur:  { bg:'#fefce8', c:'#b45309', b:'#fde68a' },
  transporteur: { bg:'#f5f3ff', c:'#7c3aed', b:'#ddd6fe' },
};

/* ── Modal Contact ─────────────────────────────────────────────────────────── */
function ModalContact({ pro, onClose }) {
  const [msg, setMsg] = useState('');
  const [ok,  setOk]  = useState(false);
  const rc = RC[pro?.role] || { bg:'#f3f4f6', c:'#555', b:'#e5e7eb' };
  if (!pro) return null;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:420, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        {ok ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48, marginBottom:10 }}>✅</div>
            <h3 style={{ color:'#16a34a', margin:0 }}>Message envoyé !</h3>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:rc.bg, color:rc.c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15, border:`2px solid ${rc.b}` }}>
                  {(pro.nom||'?').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{pro.nom}</p>
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:rc.bg, color:rc.c, fontWeight:600, textTransform:'capitalize' }}>{pro.role}</span>
                </div>
              </div>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <div style={{ background:'#f7f8fa', borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:13 }}>
              <p style={{ margin:'0 0 3px' }}>📞 <strong>{pro.telephone || '—'}</strong></p>
              <p style={{ margin:'0 0 3px' }}>📧 {pro.email}</p>
              <p style={{ margin:0 }}>📍 {pro.adresse || '—'}</p>
            </div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
              placeholder={`Bonjour ${(pro.nom||'').split(' ')[0]}...`}
              style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'9px 12px', fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box', marginBottom:14 }} />
            <div style={{ display:'flex', gap:8 }}>
              {pro.telephone && (
                <a href={`tel:${pro.telephone}`} style={{ flex:1, background:rc.bg, color:rc.c, borderRadius:8, padding:'9px', fontSize:13, fontWeight:600, textDecoration:'none', textAlign:'center' }}>📞 Appeler</a>
              )}
              <button onClick={() => { if (msg.trim()) setOk(true); else alert('Écrivez un message.'); }}
                style={{ flex:2, background:'#16a34a', color:'#fff', border:'none', borderRadius:8, padding:'9px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                ✉️ Envoyer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Modal RDV ─────────────────────────────────────────────────────────────── */
function ModalRDV({ vet, user, onClose }) {
  const [form,   setForm]   = useState({ animal:'', description:'', date:'', urgent:false });
  const [ok,     setOk]     = useState(false);
  const [erreur, setErreur] = useState('');
  if (!vet) return null;

  const envoyer = () => {
    if (!form.animal || !form.description || !form.date) {
      setErreur('Tous les champs sont obligatoires.');
      return;
    }
    rdvStore.envoyer({
      vetEmail:    vet.email,
      vetNom:      vet.nom,
      agriEmail:   user?.email  || '',
      agriNom:     user?.nom    || '',
      agriTel:     user?.telephone || '',
      agriAdresse: user?.adresse   || '',
      animal:      form.animal,
      description: form.description,
      date:        form.date,
      urgent:      form.urgent,
    });
    setOk(true);
    setTimeout(() => { setOk(false); onClose(); }, 2200);
  };

  const inp = { width:'100%', border:'1px solid #e8e8e8', borderRadius:8, padding:'9px 12px', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
  const lbl = { display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:480, width:'90%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        {ok ? (
          <div style={{ textAlign:'center', padding:'30px 0' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>{form.urgent ? '🚨' : '📅'}</div>
            <h3 style={{ color:form.urgent?'#dc2626':'#16a34a', margin:'0 0 8px', fontSize:20 }}>
              {form.urgent ? 'Urgence signalée !' : 'Demande envoyée !'}
            </h3>
            <p style={{ color:'#888', fontSize:14 }}>
              {vet.nom} va recevoir votre demande dans son tableau de bord.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <h3 style={{ margin:'0 0 3px', fontSize:17, fontWeight:700 }}>📅 Rendez-vous vétérinaire</h3>
                <p style={{ margin:0, fontSize:13, color:'#888' }}>{vet.nom} · {vet.adresse || vet.email}</p>
              </div>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>

            <button onClick={() => setForm(f => ({ ...f, urgent:!f.urgent }))}
              style={{ width:'100%', padding:11, borderRadius:10, marginBottom:14, border:form.urgent?'none':'2px dashed #fca5a5', background:form.urgent?'#dc2626':'#fff5f5', color:form.urgent?'#fff':'#dc2626', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
              {form.urgent ? '🚨 CAS URGENT ACTIVÉ — Cliquer pour annuler' : '⚠️ Signaler comme cas urgent'}
            </button>

            {erreur && (
              <div style={{ background:'#fff3cd', border:'1px solid #ffc107', borderRadius:8, padding:'8px 12px', marginBottom:12, fontSize:13, color:'#856404' }}>
                ⚠️ {erreur}
              </div>
            )}

            <div style={{ display:'grid', gap:12 }}>
              <div>
                <label style={lbl}>Animal / Espèce *</label>
                <input style={inp} value={form.animal} onChange={e => setForm(f=>({...f,animal:e.target.value}))} placeholder="Vache laitière, troupeau de moutons..." />
              </div>
              <div>
                <label style={lbl}>Date souhaitée *</label>
                <input style={inp} type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} />
              </div>
              <div>
                <label style={lbl}>Description des symptômes *</label>
                <textarea style={{ ...inp, resize:'vertical' }} rows={4}
                  value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
                  placeholder="Symptômes, durée, température, comportement..." />
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:18 }}>
              <button onClick={envoyer}
                style={{ flex:1, background:form.urgent?'#dc2626':'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                {form.urgent ? '🚨 Envoyer urgence' : '📅 Envoyer la demande'}
              </button>
              <button onClick={onClose} style={{ padding:'12px 16px', border:'1px solid #e8e8e8', borderRadius:9, background:'#fff', fontSize:13, cursor:'pointer' }}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Carte professionnel ───────────────────────────────────────────────────── */
function CardPro({ pro, onContact, onRdv }) {
  const rc = RC[pro.role] || { bg:'#f3f4f6', c:'#555', b:'#e5e7eb' };
  const initiales = (pro.nom||'?').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const roleIcon = { veterinaire:'🐄', fournisseur:'🏪', transporteur:'🚚' }[pro.role] || '👤';

  return (
    <div style={{ background:'#fff', border:`1px solid ${rc.b}`, borderRadius:14, padding:'18px', transition:'all 0.15s', cursor:'default' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 18px rgba(0,0,0,0.1)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
      <div style={{ display:'flex', gap:12, marginBottom:12 }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:rc.bg, color:rc.c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, border:`2px solid ${rc.b}`, flexShrink:0, position:'relative' }}>
          {initiales}
          <span style={{ position:'absolute', bottom:-2, right:-2, fontSize:14 }}>{roleIcon}</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{pro.nom}</p>
          <span style={{ fontSize:11, padding:'2px 9px', borderRadius:10, background:rc.bg, color:rc.c, fontWeight:600, textTransform:'capitalize' }}>
            {pro.role}
          </span>
        </div>
      </div>

      <div style={{ fontSize:13, color:'#666', marginBottom:14 }}>
        {pro.telephone && <p style={{ margin:'0 0 4px', display:'flex', gap:5 }}>📞 <span>{pro.telephone}</span></p>}
        {pro.adresse   && <p style={{ margin:'0 0 4px', display:'flex', gap:5 }}>📍 <span>{pro.adresse}</span></p>}
        <p style={{ margin:0, fontSize:11, color:'#aaa', display:'flex', gap:5 }}>✉️ <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{pro.email}</span></p>
      </div>

      <div style={{ display:'flex', gap:7 }}>
        <button onClick={() => onContact(pro)}
          style={{ flex:1, padding:'7px', borderRadius:8, border:`1px solid ${rc.b}`, background:rc.bg, color:rc.c, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          ✉️ Contacter
        </button>
        {pro.role === 'veterinaire' && (
          <button onClick={() => onRdv(pro)}
            style={{ flex:1, padding:'7px', borderRadius:8, border:'none', background:'#16a34a', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            📅 Rendez-vous
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Page principale ───────────────────────────────────────────────────────── */
export default function Contacts() {
  const { user } = useAuth();
  const [filtre,   setFiltre]   = useState('tous');
  const [search,   setSearch]   = useState('');
  const [contact,  setContact]  = useState(null);
  const [rdvVet,   setRdvVet]   = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // ✅ Charger tous les utilisateurs (mock + inscrits localement)
  useEffect(() => {
    const charger = () => {
      const tous = usersStore.getAll();
      setAllUsers(tous);
    };
    charger();
    // Recharger si quelqu'un s'inscrit dans un autre onglet
    const handler = () => charger();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const pros = allUsers
    .filter(u => ['veterinaire','fournisseur','transporteur'].includes(u.role))
    .filter(u => u.actif !== false)
    .filter(u => u.email !== user?.email) // Exclure soi-même
    .filter(u => {
      const okRole   = filtre === 'tous' || u.role === filtre;
      const term     = search.toLowerCase();
      const okSearch = !search ||
        (u.nom||'').toLowerCase().includes(term) ||
        (u.telephone||'').includes(term) ||
        (u.adresse||'').toLowerCase().includes(term) ||
        (u.email||'').toLowerCase().includes(term);
      return okRole && okSearch;
    });

  // Stats par rôle
  const stats = {
    veterinaire:  allUsers.filter(u => u.role==='veterinaire'  && u.actif!==false).length,
    fournisseur:  allUsers.filter(u => u.role==='fournisseur'  && u.actif!==false).length,
    transporteur: allUsers.filter(u => u.role==='transporteur' && u.actif!==false).length,
  };

  return (
    <div>
      {/* En-tête */}
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 3px', color:'#111' }}>📞 Contacts Professionnels</h2>
        <p style={{ color:'#888', margin:0, fontSize:14 }}>Trouvez et contactez les professionnels agricoles</p>
      </div>

      {/* Stats rapides */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[['🐄','Vétérinaires',stats.veterinaire,'#eff6ff','#2563eb'],
          ['🏪','Fournisseurs',stats.fournisseur,'#fefce8','#b45309'],
          ['🚚','Transporteurs',stats.transporteur,'#f5f3ff','#7c3aed']].map(([icon,label,count,bg,color]) => (
          <div key={label} style={{ background:bg, borderRadius:10, padding:'12px 16px', display:'flex', gap:10, alignItems:'center', cursor:'pointer' }}
            onClick={() => setFiltre(label.toLowerCase().slice(0,-1) === 'vétérinaire' ? 'veterinaire' : label.toLowerCase().slice(0,-1))}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <div>
              <p style={{ margin:0, fontSize:20, fontWeight:800, color }}>{count}</p>
              <p style={{ margin:0, fontSize:12, color:'#888' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche */}
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #e8e8e8', borderRadius:10, padding:'9px 16px', marginBottom:14, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <span style={{ fontSize:16, color:'#888' }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Nom, téléphone, ville, email..."
          style={{ border:'none', outline:'none', fontSize:14, width:'100%', fontFamily:'inherit', color:'#111' }} />
        {search && (
          <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:18, lineHeight:1 }}>×</button>
        )}
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap', alignItems:'center' }}>
        {FILTRES.map(f => (
          <button key={f.val} onClick={() => setFiltre(f.val)}
            style={{ padding:'7px 16px', borderRadius:20, fontSize:13, cursor:'pointer', fontFamily:'inherit', border:filtre===f.val?'none':'1px solid #e8e8e8', background:filtre===f.val?'#16a34a':'#fff', color:filtre===f.val?'#fff':'#555', fontWeight:filtre===f.val?600:400, transition:'all 0.12s' }}>
            {f.icon} {f.label}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:13, color:'#888' }}>
          {pros.length} professionnel(s) trouvé(s)
        </span>
      </div>

      {/* Grille */}
      {pros.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 24px', color:'#aaa' }}>
          <p style={{ fontSize:48, margin:'0 0 14px' }}>🔍</p>
          <p style={{ fontSize:15, fontWeight:600, color:'#555', margin:'0 0 6px' }}>Aucun professionnel trouvé</p>
          <p style={{ fontSize:13 }}>
            {search ? 'Modifiez votre recherche' : 'Invitez des professionnels à rejoindre NABTA'}
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(270px, 1fr))', gap:14 }}>
          {pros.map((pro, i) => (
            <CardPro key={pro.id || pro.email || i} pro={pro} onContact={setContact} onRdv={setRdvVet} />
          ))}
        </div>
      )}

      {contact && <ModalContact pro={contact} onClose={() => setContact(null)} />}
      {rdvVet  && <ModalRDV     vet={rdvVet}  user={user} onClose={() => setRdvVet(null)} />}
    </div>
  );
}