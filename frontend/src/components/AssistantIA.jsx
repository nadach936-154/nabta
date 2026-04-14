// src/components/AssistantIA.jsx
// ✅ VERSION CORRIGÉE — suppression du bloc await orphelin (ligne 533)
// L'IA utilise la base de connaissances locale (pas d'appel API externe)

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'nabta_ia_v3_';

/* ════════════════════════════════════════════════════════════════
   BASE DE CONNAISSANCES — couvre tous les domaines
════════════════════════════════════════════════════════════════ */
const KB = [
  // ── Agriculture ─────────────────────────────────────────────────
  { t:'irrigation eau arrosage goutte', r:`💧 **Irrigation optimale**

**Quand arroser ?** Tôt le matin (6h-8h) ou en soirée (18h-20h) pour éviter l'évaporation.

**Besoins par culture :**
- Blé dur : 400-600 mm/saison
- Tomates : 500-700 mm/saison
- Oliviers : 300-500 mm/saison
- Maïs : 500-800 mm/saison

**Système goutte-à-goutte** : économise 40-50% d'eau vs aspersion. Investissement récupéré en 2-3 ans.

**Conseil Tunisie** : installez des sondes d'humidité pour arroser uniquement quand nécessaire.` },

  { t:'maladie champignon rouille mildiou oïdium plante traitement', r:`🌿 **Maladies fréquentes des cultures**

**Rouille (blé)** : pustules orange/brun → fongicide triazole (Tebuconazole). Préventif en novembre.

**Mildiou (tomate/vigne)** : taches huileuses grises → Cuivre + Mancozèbe. Évitez l'arrosage foliaire.

**Oïdium** : poudre blanche sur feuilles → Soufre mouillable ou huile de neem.

**Botrytis** (pourriture grise) : tissu brun mou → Réduisez humidité, iprodione.

**Règle d'or** : traitez tôt le matin par temps sec, jamais sous pluie ou vent fort.` },

  { t:'engrais fertilisation npk azote phosphore potassium sol', r:`🌱 **Guide de fertilisation**

**N-P-K :**
- **Azote (N)** : croissance verte, feuilles. Blé : 100-150 kg N/ha
- **Phosphore (P)** : racines et floraison. 60-80 kg P₂O₅/ha
- **Potassium (K)** : qualité des fruits, résistance. 80-100 kg K₂O/ha

**Calendrier blé Tunisie :**
1. Fond : NPK 15-15-15 (200 kg/ha) au semis
2. Tallage : Urée 46% (100 kg/ha) en janvier

**Amendements naturels :**
- Compost : 20-30 t/ha tous les 3 ans
- Fumier bovin : 15-20 t/ha

⚠️ Analysez votre sol tous les 3 ans pour ajuster les doses.` },

  { t:'récolte calendrier moisson cueillette maturité', r:`📅 **Calendrier agricole Tunisie**

| Culture | Semis | Récolte |
|---|---|---|
| Blé dur | Oct-Nov | Juin-Juillet |
| Orge | Oct-Nov | Mai-Juin |
| Tomate (plein champ) | Mars-Avr | Août-Oct |
| Pomme de terre | Janv-Fév | Avr-Mai |
| Piment | Janv-Fév | Avr-Juin |
| Oliviers | — | Oct-Déc |
| Dattes | — | Sept-Nov |

**Indicateurs de maturité :**
- Blé : couleur dorée + grain dur à l'ongle
- Tomate : couleur uniforme + légère résistance
- Olive : passage vert → violet (pour huile)` },

  { t:'semis semence plantation germination graine', r:`🌱 **Techniques de semis**

**Profondeur :** 2-3x le diamètre de la graine
- Blé : 3-5 cm | Maïs : 4-6 cm
- Tomate : 0.5-1 cm | Carotte : 0.5-1 cm

**Densité Blé Dur :** 120-150 kg/ha (400-500 grains/m²)

**Température minimale du sol :**
- Blé : 8°C → semer en octobre
- Maïs : 12°C → semer en mars-avril
- Tomate : 15°C → transplanter en mars

**Traitement semences :** fongicide + insecticide avant semis.` },

  { t:'olivier olive huile oleiculture taille mouche', r:`🫒 **Culture de l'olivier en Tunisie**

**Taille :** printemps (mars-avril) après récolte.

**Fertilisation :** 100-150 g N + 60 g P + 80 g K par arbre adulte/an

**Irrigation :** 30-50 L/arbre/semaine en été.

**Mouche de l'olivier :**
→ Pièges chromatiques jaunes + phéromones
→ Traitement : spinosad ou kaolin (bio)
→ Période critique : août-septembre

**Récolte :** octobre-décembre. Pour huile : stade noir 30%, vert 70%.` },

  { t:'prix marché vente revenu agricole tunisie', r:`💰 **Prix marché agricole Tunisie 2026**

| Produit | Prix producteur |
|---|---|
| Blé dur | 600-700 DT/tonne |
| Tomates | 400-800 DT/tonne |
| Pommes de terre | 300-600 DT/tonne |
| Huile d'olive | 12-18 DT/litre |
| Dattes Deglet | 8-15 DT/kg |
| Piments | 800-1500 DT/tonne |

**Canaux de vente :**
- Marché de gros (SICA)
- Vente directe : +30-40% de marge
- NABTA Marketplace !` },

  { t:'pesticide insecticide ravageur puceron chenille', r:`🧪 **Lutte intégrée contre les ravageurs**

- Pucerons → pyrèthre naturel ou savon insecticide
- Chenilles → Bacillus thuringiensis (bio)
- Mouche blanche → Pièges jaunes + Imidaclopride
- Doryphore → rotation + pyrèthre

**Règles :** traitez tôt le matin, respectez les délais avant récolte, alternez les matières actives.` },

  // ── Technologie ─────────────────────────────────────────────────
  { t:'programmation code python javascript react html css', r:`💻 **Programmation — Je peux vous aider !**

Précisez votre langage et votre problème. Python, JavaScript, React, HTML/CSS, SQL...

**Exemples :**
- "Comment créer un tableau en Python ?"
- "Explique-moi les hooks React"
- "Comment faire une requête SQL avec JOIN ?"

Je résous étape par étape ! 🚀` },

  { t:'intelligence artificielle ia chatgpt gpt machine learning', r:`🤖 **Intelligence Artificielle**

**Types principaux :**
- **Machine Learning** : l'algorithme apprend des données
- **Deep Learning** : réseaux de neurones profonds
- **LLM** (ChatGPT, Claude, Gemini) : modèles de langage

**Comment marche ChatGPT ?**
GPT est entraîné sur des milliards de textes. Il prédit le mot le plus probable à chaque étape.

**Applications agricoles :**
- Reconnaissance de maladies par photo
- Prévision des rendements
- Optimisation de l'irrigation` },

  { t:'internet wifi réseau protocole web site', r:`🌐 **Comment fonctionne Internet ?**

1. **DNS** : traduit les noms de domaine en adresses IP
2. **TCP/IP** : protocole de transport des données
3. **HTTP/HTTPS** : protocole des pages web (S = sécurisé SSL)
4. **Routeur** : dirige les paquets vers destination

**Sécurité :** utilisez HTTPS, mot de passe WiFi fort (12+ caractères).` },

  // ── Mathématiques ────────────────────────────────────────────────
  { t:'mathématiques calcul équation algèbre géométrie', r:`📐 **Mathématiques — Prêt à vous aider !**

Posez votre question et je la résoudrai étape par étape.

**Utile pour agriculteurs :**
- Surface triangulaire : S = (base × hauteur) / 2
- Surface rectangulaire : S = longueur × largeur
- Dose engrais : (quantité/ha) × votre surface
- Rendement : production ÷ surface` },

  { t:'pourcentage pourcent calculer proportion', r:`📊 **Calculs de pourcentage**

**Formule :** % = (valeur / total) × 100

**Exemples :**
- Récolte : 3t sur 5t prévues = (3/5)×100 = **60%**
- Augmentation : 100 → 120 DT = **+20%**
- Réduction : 200 DT avec 15% off = 200×0.85 = **170 DT**

Donnez-moi vos chiffres et je calcule !` },

  // ── Santé ────────────────────────────────────────────────────────
  { t:'santé médecin maladie symptôme fièvre', r:`🏥 **Santé — Informations générales**

Je donne des informations générales, mais consultez toujours un médecin.

**Urgences Tunisie :**
- SAMU : **190**
- Pompiers : **198**
- Police : **197**

Posez votre question précise et je vous donnerai des informations générales.` },

  { t:'nutrition alimentation régime calorie protéine vitamine', r:`🥗 **Nutrition équilibrée**

**Assiette idéale :**
- 50% légumes et fruits
- 25% féculents
- 25% protéines

**Vitamines essentielles :**
- D : soleil + poisson gras
- C : agrumes, poivron
- Fer : viande, lentilles

**Régime méditerranéen** : huile d'olive, légumes, légumineuses, poisson 2x/semaine.` },

  // ── Histoire & Géographie ────────────────────────────────────────
  { t:'tunisie histoire carthage romain arabe islam', r:`📜 **Histoire de Tunisie**

- **Carthage** (814-146 av. J.-C.) : empire phénicien, Hannibal contre Rome
- **Période romaine** : Grenier de Rome, El Jem, Dougga
- **Conquête arabe** (647-670) : fondation de Kairouan
- **Ottomans** (1574-1881)
- **Protectorat français** (1881-1956)
- **Indépendance** : 20 mars 1956, Habib Bourguiba` },

  { t:'géographie afrique monde capitale pays', r:`🌍 **Tunisie — Géographie**

- Superficie : 163 610 km²
- Population : ~12 millions
- Capitale : **Tunis**
- Frontières : Algérie (ouest), Libye (est), Méditerranée (nord)

**Régions agricoles :**
- Nord (Jendouba, Béja) : céréales
- Cap Bon (Nabeul) : agrumes, tomates
- Sahel (Sfax) : oliviers
- Sud (Gafsa, Kébili) : dattes` },

  // ── Cuisine ─────────────────────────────────────────────────────
  { t:'recette cuisine couscous brik plat tunisien manger', r:`👨‍🍳 **Cuisine tunisienne**

**Couscous traditionnel (6 pers.) :**
1. Faire revenir agneau + oignons + tomate + harissa
2. Ajouter légumes (carottes, navets, courgettes, pois chiches)
3. Mijoter 45 min
4. Cuire la semoule à la vapeur 2 × 20 min
5. Servir avec sauce séparée

**Brik à l'œuf :**
- Feuille de brik + thon + câpres + persil + 1 œuf
- Plier en triangle → frire 2 min chaque côté

Dites-moi quel plat vous voulez !` },

  // ── Finance ─────────────────────────────────────────────────────
  { t:'crédit banque prêt subvention financement agricole', r:`💰 **Financement agricole Tunisie**

**BNA** (Banque Nationale Agricole) : crédits jusqu'à 500 000 DT, taux 5-7%

**APIA** : subventions jusqu'à **40%** du projet (irrigation, serres, machinerie)

**FOSDAP** : solidarité pour petits agriculteurs

**Documents requis :**
- Titre foncier / acte de location
- Plan d'affaires
- CIN + fiche personnelle

📞 Contactez votre Délégation Régionale de l'Agriculture.` },

  // ── Langue ──────────────────────────────────────────────────────
  { t:'traduction anglais français arabe espagnol langue', r:`🗣️ **Traduction et langues**

Je parle : 🇫🇷 Français · 🇬🇧 Anglais · 🇸🇦 Arabe · 🇪🇸 Espagnol

**Pour une traduction :** écrivez le texte et précisez la langue cible.

Exemple : *"Traduis en anglais : Comment irriguer les tomates ?"*
→ *"How to irrigate tomatoes?"*` },
];

/* ════════════════════════════════════════════════════════════════
   Moteur de recherche dans la KB
════════════════════════════════════════════════════════════════ */
const chercher = (question) => {
  const q = question.toLowerCase().trim();

  if (/^(bonjour|salam|hello|salut|hi\b|bonsoir|bsr)/i.test(q)) {
    return `👋 Bonjour ! Je suis votre **Assistant IA NABTA**.

Je peux répondre à **toutes vos questions** :
🌾 Agriculture & élevage · 💻 Technologie · 🧮 Mathématiques
🌍 Histoire & géographie · 👨‍🍳 Cuisine · 🏥 Santé · 💰 Finance

**Posez-moi n'importe quelle question !**`;
  }

  if (/qui es.tu|c'est quoi|présente.toi|qu'est.ce que/i.test(q)) {
    return `🌿 Je suis l'**Assistant IA NABTA** — votre compagnon intelligent.

Je réponds en français, arabe, anglais...

Quelle est votre question ? 😊`;
  }

  if (/merci|parfait|super|excellent|bravo|génial|👍/i.test(q)) {
    return "😊 De rien ! Avez-vous d'autres questions ? Je suis disponible 24h/24.";
  }

  // Calcul simple
  const calcMatch = q.match(/calcul[e]?.*?(\d+[\s×x*/+-]+\d+)/i) || q.match(/^(\d+\s*[+\-*/×]\s*\d+)/);
  if (calcMatch) {
    try {
      const expr = calcMatch[1].replace(/×|x/g, '*');
      // eslint-disable-next-line no-eval
      const result = eval(expr.replace(/[^0-9+\-*/.\\s()]/g, ''));
      if (!isNaN(result)) return `🧮 **Calcul :** ${expr.trim()} = **${result}**\n\nBesoin d'autres calculs ?`;
    } catch {}
  }

  // Recherche par mots-clés
  let bestScore = 0;
  let bestReponse = null;
  for (const item of KB) {
    const mots  = item.t.split(' ');
    const score = mots.filter(m => q.includes(m) && m.length > 3).length;
    if (score > bestScore) { bestScore = score; bestReponse = item.r; }
  }
  if (bestScore >= 1) return bestReponse;

  const premiersMots = q.split(' ').slice(0, 5).join(' ');
  return `💡 Question sur **"${premiersMots}..."**

Je peux vous aider sur :
- 🌾 **Agriculture** : cultures, irrigation, maladies, engrais
- 💻 **Technologie** : programmation, IA, web
- 🧮 **Mathématiques** : calculs, surfaces, doses
- 🌍 **Culture générale** : histoire, géographie, cuisine
- 💰 **Finance** : crédits agricoles

Précisez votre question pour une meilleure réponse !`;
};

/* ════════════════════════════════════════════════════════════════
   Formatage Markdown
════════════════════════════════════════════════════════════════ */
const renderInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`')  && p.endsWith('`'))  return <code key={i} style={{ background:'#f3f4f6', padding:'1px 4px', borderRadius:3, fontSize:12, fontFamily:'monospace' }}>{p.slice(1, -1)}</code>;
    return p;
  });
};

const MdText = ({ text }) => (
  <div style={{ fontSize:14, lineHeight:1.7 }}>
    {(text || '').split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height:6 }} />;
      if (line.startsWith('### ')) return <p key={i} style={{ margin:'6px 0 3px', fontWeight:700, fontSize:14, color:'#111' }}>{line.slice(4)}</p>;
      if (line.startsWith('## '))  return <p key={i} style={{ margin:'8px 0 4px', fontWeight:700, fontSize:15, color:'#111' }}>{line.slice(3)}</p>;
      if (line.startsWith('# '))   return <p key={i} style={{ margin:'10px 0 5px', fontWeight:700, fontSize:16, color:'#111' }}>{line.slice(2)}</p>;
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('→ ')) {
        return <p key={i} style={{ margin:'2px 0', paddingLeft:12 }}>{renderInline('• ' + line.replace(/^[-•→]\s/, ''))}</p>;
      }
      if (/^\|.*\|$/.test(line)) {
        if (line.replace(/[\|\s-]/g, '').length === 0) return null;
        const cells = line.split('|').filter(Boolean).map(c => c.trim());
        return (
          <div key={i} style={{ display:'flex', gap:0, marginBottom:2 }}>
            {cells.map((c, j) => (
              <div key={j} style={{ flex:1, padding:'4px 8px', background: i === 0 ? '#f0fdf4' : '#fff', borderBottom:'1px solid #e8e8e8', fontSize:12 }}>
                {renderInline(c)}
              </div>
            ))}
          </div>
        );
      }
      return <p key={i} style={{ margin:'2px 0' }}>{renderInline(line)}</p>;
    })}
  </div>
);

/* ════════════════════════════════════════════════════════════════
   Suggestions rapides
════════════════════════════════════════════════════════════════ */
const SUGGESTIONS = [
  '🌾 Irrigation blé Tunisie', '🫒 Taille des oliviers', '💧 Goutte-à-goutte',
  '🌿 Traiter le mildiou',     '💰 Prix marché 2026',    '🤖 C\'est quoi l\'IA ?',
  '💻 Apprendre Python',       '👨‍🍳 Recette couscous',    '📅 Calendrier semis',
];

/* ════════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL — send() utilise la KB locale (pas d'API)
════════════════════════════════════════════════════════════════ */
export default function AssistantIA() {
  const { user } = useAuth();
  const key = STORAGE_KEY + (user?.id || 'guest');

  const loadHist = () => {
    try {
      const s = localStorage.getItem(key);
      if (s) return JSON.parse(s);
    } catch {}
    return [{
      role:    'assistant',
      content: `Bonjour ${user?.nom?.split(' ')[0] || ''} ! 👋\n\nJe suis votre **Assistant IA NABTA**. Je réponds à **toutes vos questions** — agriculture, technologie, cuisine, santé, histoire, mathématiques et bien plus encore.\n\nComment puis-je vous aider aujourd'hui ?`,
      time:    new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }),
    }];
  };

  const [messages, setMessages] = useState(loadHist);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(messages.slice(-50))); } catch {}
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, key]);

  const effacer = () => {
    const init = [{
      role:    'assistant',
      content: 'Conversation effacée. Comment puis-je vous aider ?',
      time:    new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }),
    }];
    setMessages(init);
    try { localStorage.setItem(key, JSON.stringify(init)); } catch {}
  };

  // ✅ send() est une fonction NORMALE (pas async) — utilise KB locale
  const send = (texte = input) => {
    if (!texte.trim() || loading) return;

    const time = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
    const withUser = [...messages, { role:'user', content:texte, time }];
    setMessages(withUser);
    setInput('');
    setLoading(true);

    // Délai naturel pour simuler la réflexion
    setTimeout(() => {
      const reponse = chercher(texte);
      setMessages(prev => [...prev, {
        role:    'assistant',
        content: reponse,
        time:    new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }),
      }]);
      setLoading(false);
    }, 300 + Math.random() * 600);
  };

  return (
    <div style={{ maxWidth:820, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, margin:'0 0 2px', color:'#111' }}>🤖 Assistant IA</h2>
          <p style={{ fontSize:13, color:'#888', margin:0 }}>Intelligence artificielle · Répond à toutes vos questions · Historique sauvegardé</p>
        </div>
        <button onClick={effacer} style={{ border:'1px solid #e8e8e8', borderRadius:8, background:'#fff', padding:'6px 13px', fontSize:13, color:'#888', cursor:'pointer', fontFamily:'inherit' }}>
          🗑️ Effacer
        </button>
      </div>

      <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
        {/* Header */}
        <div style={{ padding:'14px 18px', background:'linear-gradient(135deg, #1a3a2a, #2d5a3d)', color:'#fff', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🌿</div>
          <div style={{ flex:1 }}>
            <p style={{ margin:0, fontWeight:700, fontSize:14 }}>Assistant IA NABTA</p>
            <p style={{ margin:0, fontSize:11, opacity:0.65 }}>Agriculture · Technologie · Culture générale · 24h/24</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:loading ? '#fbbf24' : '#4ade80', boxShadow:loading ? '0 0 6px #fbbf24' : '0 0 6px #4ade80' }} />
            <span style={{ fontSize:11, opacity:0.7 }}>{loading ? 'Réflexion...' : 'En ligne'}</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ height:440, overflowY:'auto', padding:18, display:'flex', flexDirection:'column', gap:14 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:'flex', justifyContent:msg.role==='user'?'flex-end':'flex-start', gap:8 }}>
              {msg.role === 'assistant' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#1a3a2a,#2d5a3d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, alignSelf:'flex-end' }}>🌿</div>
              )}
              <div style={{ maxWidth:'78%' }}>
                <div style={{ padding:'11px 15px', borderRadius:msg.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px', background:msg.role==='user'?'#1a3a2a':'#f7f8fa', color:msg.role==='user'?'#fff':'#111', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                  {msg.role === 'assistant'
                    ? <MdText text={msg.content} />
                    : <p style={{ margin:0, fontSize:14 }}>{msg.content}</p>
                  }
                </div>
                <p style={{ margin:'3px 0 0', fontSize:10, color:'#bbb', textAlign:msg.role==='user'?'right':'left' }}>{msg.time}</p>
              </div>
              {msg.role === 'user' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'#1a3a2a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0, alignSelf:'flex-end' }}>
                  {(user?.nom || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#1a3a2a,#2d5a3d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🌿</div>
              <div style={{ background:'#f7f8fa', borderRadius:'4px 14px 14px 14px', padding:'12px 16px', display:'flex', gap:5, alignItems:'center' }}>
                {[0, 150, 300].map(d => (
                  <div key={d} style={{ width:7, height:7, borderRadius:'50%', background:'#aaa', animation:`dotBounce 1s ${d}ms infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={{ padding:'8px 14px', borderTop:'1px solid #f0f0f0', display:'flex', gap:6, flexWrap:'wrap' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} disabled={loading}
              style={{ fontSize:11, padding:'4px 11px', borderRadius:14, border:'1px solid #e8e8e8', background:'#f7f8fa', color:'#555', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Saisie */}
        <div style={{ display:'flex', gap:8, padding:'10px 14px', borderTop:'1px solid #f0f0f0' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Posez n'importe quelle question... (Entrée pour envoyer)"
            rows={1} disabled={loading}
            style={{ flex:1, border:'1px solid #e8e8e8', borderRadius:10, padding:'9px 14px', fontSize:14, outline:'none', fontFamily:'inherit', resize:'none', lineHeight:1.5, background:loading?'#f9fafb':'#fff' }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ background:loading||!input.trim()?'#d1d5db':'#16a34a', color:'#fff', border:'none', borderRadius:10, padding:'9px 20px', fontSize:16, cursor:loading||!input.trim()?'not-allowed':'pointer', alignSelf:'flex-end' }}>
            ➤
          </button>
        </div>
        <p style={{ margin:'0 0 8px', textAlign:'center', fontSize:11, color:'#ccc' }}>
          Entrée pour envoyer · Shift+Entrée pour nouvelle ligne · Historique sauvegardé
        </p>
      </div>

      <style>{`@keyframes dotBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
    </div>
  );
}