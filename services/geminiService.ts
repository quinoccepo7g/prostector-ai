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
  const limit = settings.leadsPerSearch || 10;

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessType,
        location,
        settings
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Erro: ${response.status}`);
    }

    const data = await response.json();
    const text = data.text || "";
    const leadsData = extractJson(text);

    if (Array.isArray(leadsData)) {
      return leadsData.filter((lead: any) => lead.companyName && lead.address).slice(0, limit);
    }
    return [];

  } catch (error: any) {
    console.error("Error finding leads:", error);
    throw error;
  }
};
