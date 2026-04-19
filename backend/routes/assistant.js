// backend/routes/assistant.js
// ✅ VRAI IA — Groq (llama-3.3-70B) = niveau ChatGPT/Gemini
// Appel depuis le BACKEND → zéro problème CORS
// Fallback local intelligent si clé manquante

const express = require('express');
const router  = express.Router();
const axios   = require('axios');

// ══════════════════════════════════════════════════════════════════════════
// ⚙️  CONFIGURATION — coller votre clé Groq ici
//     → https://console.groq.com  (compte PERSONNEL, pas équipe)
// ══════════════════════════════════════════════════════════════════════════
const GROQ_KEY = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = `Tu es un assistant IA intelligent et polyvalent intégré à NABTA, 
une plateforme agricole tunisienne.

Tu réponds à ABSOLUMENT TOUTES les questions sans restriction :
- Agriculture tunisienne (cultures, irrigation, maladies, prix du marché, météo)
- Technologie et programmation (Python, JavaScript, React, IA...)
- Mathématiques, physique, chimie
- Histoire, géographie, culture générale
- Cuisine tunisienne et internationale
- Santé et nutrition
- Finance, droit, économie
- Langues et traduction (français, arabe, anglais, espagnol...)
- Météo et actualités générales
- Et tout autre domaine

Règles importantes :
1. Réponds TOUJOURS dans la langue de l'utilisateur
2. Sois précis, utile, bienveillant et complet
3. Utilise des emojis et structure tes réponses
4. Pour l'agriculture : spécialise tes réponses pour la Tunisie
5. Ne refuse JAMAIS de répondre à une question légitime`;

// ── Fallback local (si pas de clé Groq) ──────────────────────────────────
function normaliser(t) {
  return t.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\bheur\b/g, 'heure')
    .replace(/maintenent|maintanant/g, 'maintenant')
    .replace(/\bmeteo\b/g, 'meteo')
    .replace(/kairaun/g, 'kairouan');
}

const VILLES = {
  tunis:{e:[28,36],h:[8,16],p:[15,24],a:[17,27]},
  sfax:{e:[28,38],h:[9,17],p:[16,26],a:[18,28]},
  sousse:{e:[27,36],h:[9,16],p:[15,24],a:[17,27]},
  nabeul:{e:[25,34],h:[8,15],p:[14,23],a:[16,26]},
  kairouan:{e:[30,41],h:[6,15],p:[16,27],a:[17,28]},
  gafsa:{e:[31,43],h:[7,16],p:[18,29],a:[19,30]},
  tozeur:{e:[33,45],h:[8,18],p:[19,31],a:[21,32]},
  bizerte:{e:[25,33],h:[7,14],p:[13,21],a:[16,25]},
  gabes:{e:[29,38],h:[10,18],p:[16,26],a:[19,29]},
  beja:{e:[24,35],h:[6,13],p:[13,22],a:[15,24]},
};

function meteoLocale(q) {
  const m = new Date().getMonth();
  const s = m>=5&&m<=8?'e':m>=11||m<=1?'h':m>=2&&m<=4?'p':'a';
  let ville = 'tunis';
  for (const v of Object.keys(VILLES)) { if (q.includes(v)) { ville=v; break; } }
  const [mn,mx] = VILLES[ville][s];
  const nom = ville.charAt(0).toUpperCase()+ville.slice(1);
  const sn = {e:'Été ☀️',h:'Hiver 🌧',p:'Printemps 🌸',a:'Automne 🍂'}[s];
  const now = new Date();
  const h = now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Tunis'});
  const d = now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',timeZone:'Africa/Tunis'});
  return `🌤 **Météo ${nom} — ${d}**\n\n${sn} · ${mn}°C - ${mx}°C\n💧 Humidité : ${s==='e'?'35-50':s==='h'?'65-80':'50-65'}%\n⏰ Mise à jour : ${h}\n\n**Conseil :** ${s==='e'?'Irriguez tôt le matin (6h-8h)':s==='h'?'Protégez les cultures du gel':s==='p'?'Idéal pour la transplantation':'Début récolte oliviers'}`;
}

const KB_FALLBACK = [
  {m:['irrigation','arrosage','goutte'],r:`💧 **Irrigation** : Arrosez 6h-8h ou 18h-20h. Blé : 400-600mm/saison. Tomates : 500-700mm. Goutte-à-goutte économise 40-50% d'eau.`},
  {m:['mildiou','rouille','maladie','champignon','traitement'],r:`🌿 **Maladies** : Rouille→triazole · Mildiou→Cuivre+Mancozèbe · Oïdium→Soufre. Traitez tôt le matin par temps sec.`},
  {m:['engrais','npk','azote','fertilisation'],r:`🌱 **Engrais** : Blé → NPK 15-15-15 (200kg/ha) au semis + Urée (100kg/ha) en janvier.`},
  {m:['prix','marche','vente','dinar'],r:`💰 **Prix 2026** : Blé 600-700 DT/t · Tomates 400-800 DT/t · Huile olive 12-18 DT/L · Dattes 8-15 DT/kg`},
  {m:['python','javascript','code','programmation'],r:`💻 Précisez votre question de programmation (Python, JS, React...) et je vous aide étape par étape !`},
  {m:['couscous','recette','cuisine','brik'],r:`👨‍🍳 **Couscous** : 1)Revenir viande+oignons+harissa 2)Légumes+eau+safran 45min 3)Semoule vapeur 2×20min`},
];

function reponseFallback(question) {
  const q = normaliser(question);
  if (/\b(heure|heur|maintenant|il est quelle|quelle heure)\b/.test(q)) {
    const h = new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Tunis'});
    const d = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Africa/Tunis'});
    return `⏰ **${h}** (Heure de Tunisie)\n📅 ${d}`;
  }
  if (/\b(meteo|météo|temps|temperature|pluie|chaud|froid)\b/.test(q)) return meteoLocale(q);
  try {
    const e=q.replace(/×/g,'*').replace(/÷/g,'/').replace(/[^0-9+\-*/().]/g,' ').trim();
    if(/^\d[\d\s+\-*/().]+\d$/.test(e)){const r=eval(e);if(isFinite(r))return `🧮 **= ${r}**`;}
  } catch {}
  const pct=q.match(/(\d+(?:\.\d+)?)\s*%\s*de\s*(\d+(?:\.\d+)?)/);
  if(pct){const r=(pct[1]/100)*pct[2];return `🧮 ${pct[1]}% de ${pct[2]} = **${r}**`;}
  for(const item of KB_FALLBACK){if(item.m.some(m=>q.includes(m)))return item.r;}
  return `⚠️ **Mode hors-ligne** — Pour activer l'IA complète :\n\n1. Créez un compte sur **console.groq.com** (GRATUIT)\n2. Créez une clé API personnelle\n3. Ajoutez dans \`backend/.env\` : \`GROQ_API_KEY=votre_clé\`\n4. Relancez \`node server.js\``;
}

// ════════════════════════════════════════════════════════════════════════════
// ROUTE  POST /api/assistant/ask
// ════════════════════════════════════════════════════════════════════════════
router.post('/ask', async (req, res) => {
  const { question, history = [] } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ reply: 'Question vide.' });
  }

  console.log(`\n💬 Question: "${question.slice(0, 70)}"`);

  // ── Pas de clé → fallback local ─────────────────────────────────────────
  if (!GROQ_KEY || GROQ_KEY === 'gsk_VOTRE_CLE_ICI') {
    console.log('⚡ Pas de clé Groq → fallback local');
    return res.json({ reply: reponseFallback(question), source: 'local' });
  }

  // ── Appel Groq (llama-3.3-70b-versatile = niveau ChatGPT) ───────────────
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      // Historique conversationnel (max 10 échanges)
      ...history.slice(-10).map(m => ({
        role:    m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: question },
    ];

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model:       'llama-3.3-70b-versatile', // Modèle très puissant, gratuit
        messages,
        temperature: 0.7,
        max_tokens:  2000,
        stream:      false,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_KEY}`,
          'Content-Type':  'application/json',
        },
        timeout: 20000,
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log(`✅ Groq OK — ${reply.length} chars`);
    return res.json({ reply, source: 'groq' });

  } catch (err) {
    const status = err.response?.status;
    const msg    = err.response?.data?.error?.message || err.message;
    console.error(`❌ Groq erreur ${status}: ${msg}`);

    // 429 quota → fallback
    if (status === 429) {
      console.log('⏳ Quota Groq → fallback local');
      return res.json({ reply: reponseFallback(question) + '\n\n*[Quota temporairement atteint — réessayez dans 1 minute]*', source: 'local' });
    }

    return res.json({ reply: reponseFallback(question), source: 'local' });
  }
});

module.exports = router;