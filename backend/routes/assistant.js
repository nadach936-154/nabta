const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// POST /api/assistant
router.post('/', protect, async (req, res) => {
  try {
    const { messages, systeme } = req.body;

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          { role: 'system', content: systeme || 'Tu es un assistant agricole expert.' },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ],
        stream: false
      })
    });

    const data = await response.json();
    res.json({ reponse: data.message?.content || 'Désolé, pas de réponse.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
