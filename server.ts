import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // API Route for Lead Prospecting
  app.post("/api/leads", async (req, res) => {
    const { businessType, location, settings } = req.body;
    
    // Prioritize API key from environment, then from request settings
    const geminiKey = process.env.GEMINI_API_KEY || settings.geminiApiKey;
    const openaiKey = process.env.OPENAI_API_KEY || settings.openaiApiKey;

    const limit = settings.leadsPerSearch || 10;
    const model = settings.geminiModel || "gemini-3.1-flash-lite";

    const prompt = `
      Encontre exatamente ${limit} leads de negócios do tipo "${businessType}" localizados em "${location}".
      Responda APENAS com um array JSON estrito no seguinte formato:
      [
        {
          "companyName": "Nome da Empresa",
          "address": "Endereço Completo",
          "phone": "Telefone",
          "website": "URL",
          "email": "Email",
          "whatsapp": "WhatsApp",
          "instagram": "URL Instagram",
          "facebook": "URL Facebook"
        }
      ]
    `;

    try {
      if (settings.preferredProvider === 'openai') {
        if (!openaiKey) {
          return res.status(400).json({ error: "API Key da OpenAI não configurada." });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: settings.openaiModel || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || `Erro OpenAI: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices[0].message.content;
        return res.json({ success: true, text });
      }

      // Gemini Proxy
      if (!geminiKey) {
        return res.status(400).json({ error: "API Key do Gemini não configurada." });
      }

      const genAI = new GoogleGenAI(geminiKey);
      
      // Use standard SDK method
      const modelInstance = genAI.getGenerativeModel({ 
        model: model,
        tools: [{ googleSearch: {} }] as any
      });

      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return res.json({ success: true, text });

    } catch (error: any) {
      console.error("Backend error:", error);
      
      let errorMessage = error.message || "Erro interno no servidor";
      let statusCode = 500;

      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        statusCode = 429;
        errorMessage = "Limite de quota atingido. Aguarde alguns segundos ou use outra API Key.";
      }

      res.status(statusCode).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
