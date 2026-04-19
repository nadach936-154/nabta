// src/components/AssistantIA.jsx
// ✅ Appelle /api/assistant/ask (backend) → ZÉRO CORS
// L'IA Groq (llama-3.3-70B) répond à TOUT comme ChatGPT
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'nabta_ia_final_';

const SUGGESTIONS = [
  '🌾 Comment irriguer le blé ?',
  '🌤 Météo à Kairouan',
  '⏰ Quelle heure est-il ?',
  '🫒 Taille des oliviers',
  '💰 Prix tomates 2026',
  '🤖 C\'est quoi ChatGPT ?',
  '💻 Explique React en 2 min',
  '👨‍🍳 Recette couscous tunisien',
  '🧮 Calcule 25% de 840',
  '🌿 Traiter le mildiou',
];

/* ═══ Rendu Markdown ════════════════════════════════════════════════════════ */
const RI = (text) => text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g).map((p, i) => {
  if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2,-2)}</strong>;
  if (p.startsWith('*')  && p.endsWith('*') && p.length>2) return <em key={i}>{p.slice(1,-1)}</em>;
  if (p.startsWith('`')  && p.endsWith('`')) return <code key={i} style={{background:'#f3f4f6',padding:'1px 5px',borderRadius:4,fontSize:12,fontFamily:'monospace'}}>{p.slice(1,-1)}</code>;
  return p;
});

const MdText = ({ text }) => (
  <div style={{ fontSize:14, lineHeight:1.8 }}>
    {(text||'').split('\n').map((ln, i) => {
      if (!ln.trim()) return <div key={i} style={{height:5}} />;
      if (ln.startsWith('### ')) return <p key={i} style={{margin:'6px 0 3px',fontWeight:700,fontSize:14,color:'#111'}}>{ln.slice(4)}</p>;
      if (ln.startsWith('## '))  return <p key={i} style={{margin:'8px 0 4px',fontWeight:700,fontSize:15,color:'#111'}}>{ln.slice(3)}</p>;
      if (ln.startsWith('# '))   return <p key={i} style={{margin:'10px 0 5px',fontWeight:700,fontSize:16,color:'#111'}}>{ln.slice(2)}</p>;
      if (/^[-•*]\s/.test(ln))   return <p key={i} style={{margin:'2px 0',paddingLeft:16}}>{RI('• '+ln.replace(/^[-•*]\s/,''))}</p>;
      if (/^\d+\.\s/.test(ln))   return <p key={i} style={{margin:'2px 0',paddingLeft:16}}>{RI(ln)}</p>;
      if (/^\|.*\|$/.test(ln) && ln.replace(/[\|\s:-]/g,'').length>0) {
        const cells = ln.split('|').filter(Boolean).map(c=>c.trim());
        return (
          <div key={i} style={{display:'flex',marginBottom:2}}>
            {cells.map((c,j)=>(
              <div key={j} style={{flex:1,padding:'4px 8px',background:i===0?'#f0fdf4':'#fff',borderBottom:'1px solid #e8e8e8',fontSize:12}}>
                {RI(c)}
              </div>
            ))}
          </div>
        );
      }
      return <p key={i} style={{margin:'2px 0'}}>{RI(ln)}</p>;
    })}
  </div>
);

/* ═══ Composant principal ═══════════════════════════════════════════════════ */
export default function AssistantIA() {
  const { user } = useAuth();
  const sKey = STORAGE_KEY + (user?.id || 'guest');

  const initMsgs = () => {
    try { const s=localStorage.getItem(sKey); if(s) return JSON.parse(s); } catch {}
    return [{
      role:    'assistant',
      content: `Bonjour ${user?.nom?.split(' ')[0]||''} ! 👋\n\nJe suis votre **Assistant IA NABTA** — propulsé par une intelligence artificielle avancée.\n\nJe réponds à **absolument toutes vos questions** :\n🌾 Agriculture · 🌤 Météo · ⏰ Heure · 💻 Tech\n🧮 Maths · 🌍 Culture · 👨‍🍳 Cuisine · 🏥 Santé\n\nComment puis-je vous aider ?`,
      time:    new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
    }];
  };

  const [messages, setMessages] = useState(initMsgs);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [source,   setSource]   = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(sKey, JSON.stringify(messages.slice(-80))); } catch {}
    bottomRef.current?.scrollIntoView({behavior:'smooth'});
  }, [messages, sKey]);

  const addMsg = (role, content) => ({
    role, content,
    time: new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
  });

  /* ── Envoi via le backend ─────────────────────────────────────────────── */
  const send = async (texte = input) => {
    if (!texte.trim() || loading) return;

    setMessages(prev => [...prev, addMsg('user', texte)]);
    setInput('');
    setLoading(true);

    // Construire l'historique pour le contexte
    const history = messages.slice(-16).map(m => ({
      role: m.role, content: m.content,
    }));

    try {
      // ✅ Appel backend — JAMAIS d'appel direct API externe depuis le browser
      const resp = await fetch('/api/assistant/ask', {
        method:  'POST',
        headers: {'Content-Type':'application/json'},
        body:    JSON.stringify({ question: texte, history }),
      });

      if (!resp.ok) throw new Error(`Erreur serveur ${resp.status}`);

      const data = await resp.json();
      setSource(data.source || '');
      setMessages(prev => [...prev, addMsg('assistant', data.reply || 'Pas de réponse.')]);

    } catch (err) {
      console.error('Assistant:', err);
      setMessages(prev => [...prev, addMsg('assistant',
        `❌ **Serveur backend non démarré.**\n\nLancez le backend :\n\`\`\`\ncd backend\nnode server.js\n\`\`\``
      )]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const effacer = () => {
    const init = [addMsg('assistant','🗑️ Conversation effacée. Comment puis-je vous aider ?')];
    setMessages(init);
    try { localStorage.setItem(sKey, JSON.stringify(init)); } catch {}
  };

  /* ── UI ───────────────────────────────────────────────────────────────── */
  const tagLabel = source==='groq' ? '⚡ Groq AI · Llama 3.3' : source==='local' ? '💡 Mode local' : '';
  const tagColor = source==='groq' ? '#7c3aed' : '#16a34a';

  return (
    <div style={{maxWidth:860, margin:'0 auto'}}>

      {/* Titre */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,margin:'0 0 2px',color:'#111',display:'flex',alignItems:'center',gap:8}}>
            🤖 Assistant IA
            {tagLabel && (
              <span style={{fontSize:11,background:tagColor,color:'#fff',padding:'2px 10px',borderRadius:12,fontWeight:700}}>
                {tagLabel}
              </span>
            )}
          </h2>
          <p style={{fontSize:13,color:'#888',margin:0}}>
            Intelligence artificielle · Répond à tout · Historique sauvegardé
          </p>
        </div>
        <button onClick={effacer}
          style={{border:'1px solid #e8e8e8',borderRadius:8,background:'#fff',padding:'6px 13px',fontSize:13,color:'#888',cursor:'pointer',fontFamily:'inherit'}}>
          🗑️ Effacer
        </button>
      </div>

      <div style={{background:'#fff',border:'1px solid #e8e8e8',borderRadius:16,overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>

        {/* Header */}
        <div style={{padding:'16px 22px',background:'linear-gradient(135deg,#1a3a2a 0%,#2d6a4a 100%)',color:'#fff',display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>
            🌿
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
              <p style={{margin:0,fontWeight:700,fontSize:15}}>Assistant IA NABTA</p>
              <span style={{fontSize:11,background:'rgba(255,255,255,0.2)',borderRadius:8,padding:'2px 8px',color:'rgba(255,255,255,0.9)'}}>
                IA Avancée
              </span>
            </div>
            <p style={{margin:0,fontSize:12,opacity:0.7}}>Agriculture · Météo · Tech · Cuisine · Maths · Histoire · Santé · 24h/24</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:9,height:9,borderRadius:'50%',background:loading?'#fbbf24':'#4ade80',boxShadow:loading?'0 0 8px #fbbf24':'0 0 10px #4ade80',transition:'all 0.3s'}} />
            <span style={{fontSize:12,opacity:0.8}}>{loading?'Réflexion...':'En ligne'}</span>
          </div>
        </div>

        {/* Zone messages */}
        <div style={{height:460,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:16}}>
          {messages.map((msg, i) => (
            <div key={i} style={{display:'flex',justifyContent:msg.role==='user'?'flex-end':'flex-start',gap:10,alignItems:'flex-end'}}>
              {msg.role==='assistant' && (
                <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1a3a2a,#2d6a4a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>
                  🌿
                </div>
              )}
              <div style={{maxWidth:'75%'}}>
                <div style={{padding:'12px 16px',borderRadius:msg.role==='user'?'18px 4px 18px 18px':'4px 18px 18px 18px',background:msg.role==='user'?'#1a3a2a':'#f7f8fa',color:msg.role==='user'?'#fff':'#111',boxShadow:'0 1px 6px rgba(0,0,0,0.07)'}}>
                  {msg.role==='assistant'
                    ? <MdText text={msg.content} />
                    : <p style={{margin:0,fontSize:14}}>{msg.content}</p>}
                </div>
                <p style={{margin:'4px 0 0',fontSize:10,color:'#bbb',textAlign:msg.role==='user'?'right':'left'}}>
                  {msg.time}
                </p>
              </div>
              {msg.role==='user' && (
                <div style={{width:36,height:36,borderRadius:'50%',background:'#1a3a2a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff',flexShrink:0}}>
                  {(user?.nom||'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {/* Loader */}
          {loading && (
            <div style={{display:'flex',gap:10,alignItems:'flex-end'}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1a3a2a,#2d6a4a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>🌿</div>
              <div style={{background:'#f7f8fa',borderRadius:'4px 18px 18px 18px',padding:'14px 18px',display:'flex',gap:5,alignItems:'center'}}>
                {[0,160,320].map(d=>(
                  <div key={d} style={{width:8,height:8,borderRadius:'50%',background:'#16a34a',animation:`pulse 1.4s ${d}ms ease-in-out infinite`,opacity:0.7}} />
                ))}
                <span style={{fontSize:12,color:'#999',marginLeft:8}}>L'IA réfléchit...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={{padding:'10px 18px',borderTop:'1px solid #f0f0f0',display:'flex',gap:6,flexWrap:'wrap',background:'#fafafa'}}>
          {SUGGESTIONS.map(s=>(
            <button key={s} onClick={()=>send(s)} disabled={loading}
              style={{fontSize:11,padding:'5px 12px',borderRadius:20,border:'1px solid #e2e8f0',background:'#fff',color:'#555',cursor:loading?'not-allowed':'pointer',fontFamily:'inherit',whiteSpace:'nowrap',opacity:loading?0.5:1,transition:'all 0.12s'}}
              onMouseEnter={e=>{if(!loading){e.target.style.background='#1a3a2a';e.target.style.color='#fff';e.target.style.borderColor='#1a3a2a';}}}
              onMouseLeave={e=>{e.target.style.background='#fff';e.target.style.color='#555';e.target.style.borderColor='#e2e8f0';}}>
              {s}
            </button>
          ))}
        </div>

        {/* Saisie */}
        <div style={{display:'flex',gap:10,padding:'14px 18px',borderTop:'1px solid #f0f0f0'}}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Posez n'importe quelle question... (Entrée pour envoyer)"
            rows={1}
            disabled={loading}
            style={{flex:1,border:'1.5px solid #e2e8f0',borderRadius:12,padding:'10px 16px',fontSize:14,outline:'none',fontFamily:'inherit',resize:'none',lineHeight:1.5,background:loading?'#f8fafc':'#fff',transition:'all 0.2s'}}
            onFocus={e=>{e.target.style.borderColor='#16a34a';e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,0.12)';}}
            onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none';}}
          />
          <button
            onClick={()=>send()}
            disabled={loading||!input.trim()}
            style={{background:loading||!input.trim()?'#e2e8f0':'#16a34a',color:loading||!input.trim()?'#9ca3af':'#fff',border:'none',borderRadius:12,padding:'10px 24px',fontSize:20,cursor:loading||!input.trim()?'not-allowed':'pointer',alignSelf:'flex-end',flexShrink:0,transition:'all 0.15s',boxShadow:loading||!input.trim()?'none':'0 3px 12px rgba(22,163,74,0.4)'}}>
            ➤
          </button>
        </div>

        <p style={{margin:'0 0 10px',textAlign:'center',fontSize:11,color:'#bbb'}}>
          Entrée pour envoyer · Shift+Entrée pour nouvelle ligne · Historique sauvegardé automatiquement
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}