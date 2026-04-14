const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/ask", async (req, res) => {
  const { question } = req.body;

  console.log("Question reçue:", question);
  console.log("Clé Groq:", process.env.GROQ_API_KEY ? "présente" : "MANQUANTE");

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant agricole pour NABTA."
          },
          {
            role: "user",
            content: question
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error("Erreur complète:", error.response?.data || error.message);
    res.status(500).json({ reply: "Erreur serveur, réessaie." });
  }
});

module.exports = router;