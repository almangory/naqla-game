/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini API successfully initialized on the server.');
    } catch (err) {
      console.error('Error initializing Gemini API client:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY is not configured or uses placeholder value. AI features will fallback gracefully.');
  }

  // --- API Routes ---

  // Chat with companion Simsim (سمسم)
  app.post('/api/companion/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!ai) {
        // Safe, engaging fallback if the API Key is not configured yet
        const fallbacks = [
          "أهلاً بك يا بطل! أنا صديقك سمسم، مرشدك في أكاديمية نقلة للأطفال! 🦉🇸🇩 حبابك عشرة بلا كشرة! أنا فخور جداً بذكائك واجتهادك!",
          "سؤال رائع جداً يا ذكي! 🌟 في أكاديمية نقلة، نحب دائماً أن نسأل ونستكشف. جرّب لعبة العلوم أو واحة التراث لتتعلم المزيد عن السودان والكون! 🇸🇩🧪",
          "يا لك من مستكشف عبقري! 🧠 هل تعلم أن أهرامات مروي في شمال السودان تحكي قصة أجدادنا ملوك كوش العظماء؟ واصل اللعب لكسب المزيد من النجوم! ⭐⛰️",
          "أنت فخر أكاديمية نقلة! استمر في حل التحديات لجمع النجوم وتزيين ألعابك المفضلة! 🧸🏅"
        ];
        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return res.json({
          reply: randomFallback,
          suggestedQuestion: "ما هي أهرامات البجراوية؟ 🇸🇩",
          emoji: "🦉"
        });
      }

      // Format conversation history for Gemini if present
      const systemInstruction = `
You are Simsim (سمسم), an adorable, wise, and enthusiastic cartoon tutor owl who is the chief learning guide of "Naqla Academy for Kids" (أكاديمية نقلة للأطفال) in Sudan.
Your goal is to answer their science, physics, arithmetic, alphabet, or Sudan heritage questions in very simple, highly encouraging, and fun Arabic (اللغة العربية الفصحى المبسطة or friendly Sudanese kid-friendly touch).
Guidelines:
1. Always sound cheerful, hospitable ("حبابكم عشرة"), and extremely encouraging. Use happy emojis (like 🦉, 🇸🇩, 🌟, ✨, 🚀, 🏺, 🌴, ⛰️).
2. NEVER give dry, long, or academic lectures. Keep your replies under 3-4 short sentences so kids don't get bored.
3. Express pride in Sudan's children, their intelligence, and their amazing heritage!
4. If they ask for a puzzle/riddle (أحجية / حزورة) or wants critical thinking: give them a fun, very simple scientific, physical, math, or Sudanese heritage riddle, and prompt them to think about it!
5. Return a structured JSON response containing exactly these fields:
  - "reply": Your cheerful text response or riddle in Arabic.
  - "suggestedQuestion": A short, kid-friendly next question they might ask (e.g., "لماذا النيل لونه أزرق؟ 🌊" or "كيف تطير الطيور؟ 🦅").
  - "emoji": A single representative cartoon emoji (e.g. "🦉", "🇸🇩", "💡", "🏺").
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `الطفل يسألك أو يتحدث معك: "${message}"` }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.8,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'The sweet, animated kid-friendly Arabic response.',
              },
              suggestedQuestion: {
                type: Type.STRING,
                description: 'A suggestive simple follow-up question the kid can click next.',
              },
              emoji: {
                type: Type.STRING,
                description: 'A single cartoon emoji fitting the theme of the message.',
              },
            },
            required: ['reply', 'suggestedQuestion', 'emoji'],
          },
        },
      });

      const resultText = response.text || '{}';
      try {
        const parsed = JSON.parse(resultText);
        return res.json(parsed);
      } catch (e) {
        return res.json({
          reply: response.text || "أنا معك يا بطل! استمر في التعلم اللذيذ! 🦉⭐",
          suggestedQuestion: "ما هي الجاذبية؟",
          emoji: "🦉"
        });
      }

    } catch (error: any) {
      console.error('Error with Gemini API:', error);
      return res.status(500).json({
        error: 'حدث خطأ ما في الاتصال بسمسم',
        reply: "أوه! يبدو أن جناحاي متعبان قليلاً الآن 🦉. لكن يمكنك الاستمرار في اللعب وجمع النجوم بينما أرتاح!",
        suggestedQuestion: "ما هي الألوان؟",
        emoji: "🦉"
      });
    }
  });

  // --- Vite & Production Static File Serving ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Development server running at http://localhost:${PORT}`);
  });
}

startServer();
