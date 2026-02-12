const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.GEMINI_API_KEY;
const model = "gemini-pro";

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]) {
      const aiReply = data.candidates[0].content.parts[0].text;
      res.json({ text: aiReply });
    } else {
      res.json({ text: "No response generated." });
    }
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ text: "Server error while contacting Gemini API." });
  }
});

app.listen(port, () => {
  console.log(`AI backend server running at http://localhost:${port}`);
});
