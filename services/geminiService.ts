import { GoogleGenAI } from "@google/genai";
import { Lead, AppSettings } from "../types";

// Helper to extract JSON from markdown code block
const extractJson = (text: string): any[] => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON from response:", e);
      return [];
    }
  }
  // Fallback if no code block is found but the content might be JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    // Sometimes it returns the JSON without backticks
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
        try {
            return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
        } catch (innerE) {
            console.error("Fallback JSON parse failed:", innerE);
        }
    }
    console.error("Response is not a valid JSON string:", text);
  }
  return [];
};

export const findLeads = async (
  businessType: string,
  location: string,
  settings: AppSettings
): Promise<Omit<Lead, 'id' | 'status'>[]> => {
  const { preferredProvider, geminiApiKey, openaiApiKey, leadsPerSearch, geminiModel, openaiModel } = settings;
  const limit = leadsPerSearch || 10;

  const prompt = `
    Encontre exatamente ${limit} leads de negócios do tipo "${businessType}" localizados em "${location}".
    Use a busca na web para encontrar informações detalhadas de contato para cada lead.
    Para cada lead, forneça:
    - companyName: Nome da empresa.
    - address: Endereço completo.
    - phone: Telefone principal.
    - website: Website oficial.
    - email: Email de contato.
    - whatsapp: Número de WhatsApp.
    - instagram: URL do Instagram.
    - facebook: URL do Facebook.

    Formate como um array JSON estrito:
    \`\`\`json
    [
      {
        "companyName": "Exemplo",
        "address": "Rua X, 123",
        "phone": "...",
        "website": "...",
        "email": "...",
        "whatsapp": "...",
        "instagram": "...",
        "facebook": "..."
      }
    ]
    \`\`\`
  `;

  if (preferredProvider === 'openai') {
    if (!openaiApiKey) throw new Error("API Key da OpenAI não configurada.");
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: openaiModel || 'gpt-4o-mini',
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
      const leadsData = extractJson(text);
      return Array.isArray(leadsData) ? leadsData.slice(0, limit) : [];
    } catch (error: any) {
      console.error("OpenAI Error:", error);
      throw new Error("Erro na OpenAI: " + error.message);
    }
  }

  // Gemini logic
  if (!geminiApiKey) {
    throw new Error("API Key do Gemini não configurada.");
  }

  const client = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  try {
    const model = settings.geminiModel || "gemini-3.1-flash-lite";
    const response = await (client as any).models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    
    const text = response.text || "";
    const leadsData = extractJson(text);

    if (Array.isArray(leadsData)) {
        return leadsData.filter((lead: any) => lead.companyName && lead.address).slice(0, limit);
    }
    return [];

  } catch (error: any) {
    console.error("Error finding leads:", error);
    const msg = error.message || "";
    
    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("Limite de quota atingido no Gemini. Como você está usando a versão gratuita, aguarde alguns segundos ou use a API da OpenAI. Se o erro persistir, verifique seu faturamento no Google AI Studio.");
    }
    if (msg.includes("404") || msg.includes("not found")) {
        throw new Error(`Modelo "${settings.geminiModel}" não encontrado ou não suportado nesta região. Experimente o "Gemini 3.1 Flash Lite" nas configurações.`);
    }
    if (msg.includes("API_KEY_INVALID")) {
        throw new Error("Chave de API do Gemini inválida. Verifique em Configurações.");
    }
    throw new Error("Falha ao buscar leads: " + (error.message || "Erro desconhecido"));
  }
};
