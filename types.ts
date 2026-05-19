export type KanbanStatus = string;

export interface AppSettings {
  geminiApiKey: string;
  geminiModel: 'gemini-3.1-flash-lite' | 'gemini-3-flash-preview' | 'gemini-flash-latest' | 'gemini-1.5-flash';
  openaiApiKey?: string;
  openaiModel?: string;
  preferredProvider: 'gemini' | 'openai';
  leadsPerSearch: number;
  kanbanColumns: string[];
}

export interface Lead {
  id: string;
  companyName: string;
  address: string;
  phone?: string;
  website?: string;
  contactName?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  status: KanbanStatus;
  notes?: string;
}
