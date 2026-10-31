const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AI Mystery Room Backend Running!' });
});

app.post('/api/game/action', async (req, res) => {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { action } = req.body;

    const prompt = `You are the Game Master of an AI Mystery Room. The player performs this action: "${action || 'Look around'}". Respond in a compelling, immersive way describing what happens next in 2-3 sentences.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt
    });

    res.json({ response: result.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process game action' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

