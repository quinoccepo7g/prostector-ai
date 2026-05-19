import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

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
  apiKey: string,
  limit: number = 10
): Promise<Omit<Lead, 'id' | 'status'>[]> => {
  if (!apiKey) {
    throw new Error("API Key não configurada. Vá em Configurações para adicionar.");
  }

  const ai = new GoogleGenAI({ 
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  
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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} } as any],
      }
    });
    
    const text = response.text || "";
    const leadsData = extractJson(text.trim());

    if (Array.isArray(leadsData)) {
        return leadsData.filter(lead => lead.companyName && lead.address).slice(0, limit);
    }
    
    return [];

  } catch (error: any) {
    console.error("Error finding leads:", error);
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key not valid")) {
        throw new Error("Chave de API do Gemini inválida. Verifique em Configurações.");
    }
    throw new Error("Falha ao buscar leads: " + (error.message || "Erro desconhecido"));
  }
};
