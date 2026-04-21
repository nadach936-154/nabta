// src/pages/Parametres.jsx
// ✅ BUG 5 : Page paramètres — modifier coordonnées, mot de passe, supprimer compte
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usersStore } from '../context/AuthContext';
import axios from 'axios';

export default function Parametres() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [onglet, setOnglet] = useState('profil'); // profil | securite | supprimer

  // Formulaire profil
  const [profil, setProfil]   = useState({ nom:user?.nom||'', telephone:user?.telephone||'', adresse:user?.adresse||'' });
  const [msgProfil, setMsgProfil] = useState('');
  const [loadProfil, setLoadProfil] = useState(false);

  // Formulaire mot de passe
  const [mdp, setMdp] = useState({ ancien:'', nouveau:'', confirmer:'' });
  const [msgMdp, setMsgMdp] = useState('');
  const [loadMdp, setLoadMdp] = useState(false);

  // Suppression compte
  const [confirmSuppr, setConfirmSuppr] = useState('');
  const [loadSuppr, setLoadSuppr] = useState(false);

  /* ── Sauvegarder profil ───────────────────────────────────────────────── */
  const sauvegarderProfil = async () => {
    if (!profil.nom.trim()) return setMsgProfil({ type:'err', txt:'Le nom est obligatoire.' });
    setLoadProfil(true);
    try {
      // Mettre à jour côté backend
      await axios.put('/api/auth/profil', profil);
      // Mettre à jour dans le store local
      usersStore.updateUser(user.email, profil);
      setMsgProfil({ type:'ok', txt:'✅ Profil mis à jour avec succès !' });
    } catch (err) {
      // Si backend indisponible, màj locale seulement
      usersStore.updateUser(user.email, profil);
      setMsgProfil({ type:'ok', txt:'✅ Profil mis à jour (mode local).' });
    } finally {
      setLoadProfil(false);
      setTimeout(() => setMsgProfil(''), 4000);
    }
  };

  /* ── Changer mot de passe ─────────────────────────────────────────────── */
  const changerMdp = async () => {
    if (!mdp.ancien || !mdp.nouveau || !mdp.confirmer)
      return setMsgMdp({ type:'err', txt:'Remplissez tous les champs.' });
    if (mdp.nouveau.length < 6)
      return setMsgMdp({ type:'err', txt:'Nouveau mot de passe : minimum 6 caractères.' });
    if (mdp.nouveau !== mdp.confirmer)
      return setMsgMdp({ type:'err', txt:'Les mots de passe ne correspondent pas.' });

    setLoadMdp(true);
    try {
      await axios.put('/api/auth/changer-mdp', { ancienMdp:mdp.ancien, nouveauMdp:mdp.nouveau });
      setMsgMdp({ type:'ok', txt:'✅ Mot de passe modifié avec succès !' });
      setMdp({ ancien:'', nouveau:'', confirmer:'' });
    } catch (err) {
      setMsgMdp({ type:'err', txt: err.response?.data?.message || 'Mot de passe actuel incorrect.' });
    } finally {
      setLoadMdp(false);
      setTimeout(() => setMsgMdp(''), 5000);
    }
  };

  /* ── Supprimer compte ─────────────────────────────────────────────────── */
  const supprimerCompte = async () => {
    if (confirmSuppr !== 'SUPPRIMER') return;
    setLoadSuppr(true);
    try {
      await axios.delete('/api/auth/compte');
    } catch {}
    usersStore.removeUser(user.email);
    logout();
    navigate('/');
  };

  const inp = { width:'100%', border:'1px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
  const lbl = { display:'block', fontSize:12, fontWeight:600, color:'#555', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' };

  const ROLE_COLOR = { agriculteur:'#16a34a', fournisseur:'#b45309', veterinaire:'#2563eb', transporteur:'#7c3aed', admin:'#dc2626' };
  const rc = ROLE_COLOR[user?.role] || '#16a34a';

  return (
    <div style={{ maxWidth:700, margin:'0 auto' }}>
      <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 4px', color:'#111' }}>⚙️ Paramètres</h2>
      <p style={{ color:'#888', margin:'0 0 24px', fontSize:14 }}>Gérez votre compte et vos informations</p>

      {/* Carte profil */}
      <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:14, padding:'20px', marginBottom:20, display:'flex', gap:16, alignItems:'center' }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:rc+'20', color:rc, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:20, border:`2px solid ${rc}40`, flexShrink:0 }}>
          {(user?.nom||'?').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
        </div>
        <div>
          <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:16, color:'#111' }}>{user?.nom}</p>
          <p style={{ margin:'0 0 3px', fontSize:13, color:'#888' }}>{user?.email}</p>
          <span style={{ fontSize:11, padding:'2px 10px', borderRadius:10, background:rc+'18', color:rc, fontWeight:700, textTransform:'capitalize' }}>{user?.role}</span>
        </div>
      </div>

      {/* Onglets */}
      <div style={{ display:'flex', gap:0, marginBottom:20, background:'#f7f8fa', borderRadius:10, padding:4 }}>
        {[['profil','👤 Profil'],['securite','🔒 Sécurité'],['supprimer','🗑️ Supprimer']].map(([v,l]) => (
          <button key={v} onClick={() => setOnglet(v)}
            style={{ flex:1, padding:'8px 12px', borderRadius:8, border:'none', fontSize:13, fontWeight:onglet===v?700:400, background:onglet===v?'#fff':'transparent', color:onglet===v?v==='supprimer'?'#dc2626':'#111':'#888', cursor:'pointer', fontFamily:'inherit', boxShadow:onglet===v?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ── PROFIL ── */}
      {onglet === 'profil' && (
        <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:14, padding:'24px' }}>
          <h3 style={{ fontSize:16, fontWeight:700, margin:'0 0 18px', color:'#111' }}>Informations personnelles</h3>
          {msgProfil && (
            <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:8, background:msgProfil.type==='ok'?'#f0fdf4':'#fff3f3', border:`1px solid ${msgProfil.type==='ok'?'#bbf7d0':'#fca5a5'}`, fontSize:13, color:msgProfil.type==='ok'?'#16a34a':'#dc2626' }}>
              {msgProfil.txt}
            </div>
          )}
          <div style={{ display:'grid', gap:14 }}>
            <div>
              <label style={lbl}>Nom complet *</label>
              <input style={inp} value={profil.nom} onChange={e=>setProfil(p=>({...p,nom:e.target.value}))} placeholder="Votre nom complet" />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input style={{ ...inp, background:'#f9fafb', color:'#888', cursor:'not-allowed' }} value={user?.email} disabled />
              <p style={{ margin:'4px 0 0', fontSize:11, color:'#aaa' }}>L'email ne peut pas être modifié</p>
            </div>
            <div>
              <label style={lbl}>Téléphone</label>
              <input style={inp} value={profil.telephone} onChange={e=>setProfil(p=>({...p,telephone:e.target.value}))} placeholder="+216 XX XXX XXX" />
            </div>
            <div>
              <label style={lbl}>Adresse / Ville</label>
              <input style={inp} value={profil.adresse} onChange={e=>setProfil(p=>({...p,adresse:e.target.value}))} placeholder="Tunis, Sfax, Nabeul..." />
            </div>
          </div>
          <button onClick={sauvegarderProfil} disabled={loadProfil}
            style={{ marginTop:20, background:'#16a34a', color:'#fff', border:'none', borderRadius:9, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:loadProfil?'not-allowed':'pointer', fontFamily:'inherit', opacity:loadProfil?0.7:1 }}>
            {loadProfil ? '⏳ Sauvegarde...' : '💾 Sauvegarder les modifications'}
          </button>
        </div>
      )}

      {/* ── SÉCURITÉ ── */}
      {onglet === 'securite' && (
        <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:14, padding:'24px' }}>
          <h3 style={{ fontSize:16, fontWeight:700, margin:'0 0 18px', color:'#111' }}>Changer le mot de passe</h3>
          {msgMdp && (
            <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:8, background:msgMdp.type==='ok'?'#f0fdf4':'#fff3f3', border:`1px solid ${msgMdp.type==='ok'?'#bbf7d0':'#fca5a5'}`, fontSize:13, color:msgMdp.type==='ok'?'#16a34a':'#dc2626' }}>
              {msgMdp.txt}
            </div>
          )}
          <div style={{ display:'grid', gap:14 }}>
            <div>
              <label style={lbl}>Mot de passe actuel *</label>
              <input style={inp} type="password" value={mdp.ancien} onChange={e=>setMdp(p=>({...p,ancien:e.target.value}))} placeholder="••••••••" />
            </div>
            <div>
              <label style={lbl}>Nouveau mot de passe * (min. 6 caractères)</label>
              <input style={inp} type="password" value={mdp.nouveau} onChange={e=>setMdp(p=>({...p,nouveau:e.target.value}))} placeholder="••••••••" />
              {mdp.nouveau.length > 0 && (
                <div style={{ display:'flex', gap:3, marginTop:5 }}>
                  {[1,2,3,4,5].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=mdp.nouveau.length?(mdp.nouveau.length<3?'#ef4444':mdp.nouveau.length<6?'#f59e0b':'#16a34a'):'#e5e7eb' }} />)}
                </div>
              )}
            </div>
            <div>
              <label style={lbl}>Confirmer le nouveau mot de passe *</label>
              <input style={{ ...inp, borderColor:mdp.confirmer&&mdp.confirmer!==mdp.nouveau?'#ef4444':'#e2e8f0' }} type="password" value={mdp.confirmer} onChange={e=>setMdp(p=>({...p,confirmer:e.target.value}))} placeholder="••••••••" />
            </div>
          </div>
          <button onClick={changerMdp} disabled={loadMdp}
            style={{ marginTop:20, background:'#2563eb', color:'#fff', border:'none', borderRadius:9, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:loadMdp?'not-allowed':'pointer', fontFamily:'inherit', opacity:loadMdp?0.7:1 }}>
            {loadMdp ? '⏳ Modification...' : '🔒 Changer le mot de passe'}
          </button>
        </div>
      )}

      {/* ── SUPPRIMER ── */}
      {onglet === 'supprimer' && (
        <div style={{ background:'#fff', border:'2px solid #fca5a5', borderRadius:14, padding:'24px' }}>
          <h3 style={{ fontSize:16, fontWeight:700, margin:'0 0 8px', color:'#dc2626' }}>⚠️ Supprimer mon compte</h3>
          <p style={{ fontSize:14, color:'#555', margin:'0 0 16px', lineHeight:1.6 }}>
            Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées définitivement.
          </p>
          <div style={{ background:'#fff5f5', border:'1px solid #fecaca', borderRadius:9, padding:'14px', marginBottom:18 }}>
            <p style={{ margin:'0 0 6px', fontSize:13, fontWeight:600, color:'#dc2626' }}>Données qui seront supprimées :</p>
            <p style={{ margin:0, fontSize:13, color:'#666' }}>• Votre profil et compte · Vos produits publiés · Vos commandes · Votre historique</p>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ ...lbl, color:'#dc2626' }}>Tapez "SUPPRIMER" pour confirmer</label>
            <input style={{ ...inp, borderColor:'#fca5a5' }} value={confirmSuppr} onChange={e=>setConfirmSuppr(e.target.value)} placeholder="SUPPRIMER" />
          </div>
          <button onClick={supprimerCompte} disabled={confirmSuppr!=='SUPPRIMER'||loadSuppr}
            style={{ background:confirmSuppr==='SUPPRIMER'?'#dc2626':'#d1d5db', color:'#fff', border:'none', borderRadius:9, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:confirmSuppr==='SUPPRIMER'?'pointer':'not-allowed', fontFamily:'inherit' }}>
            {loadSuppr ? '⏳ Suppression...' : '🗑️ Supprimer définitivement mon compte'}
          </button>
        </div>
      )}
    </div>
  );
}