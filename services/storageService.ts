import { Lead, AppSettings } from '../types';

const LEADS_STORAGE_KEY = 'leads';
const SETTINGS_STORAGE_KEY = 'prospector_settings';

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  openaiApiKey: '',
  openaiModel: 'gpt-4o-mini',
  preferredProvider: 'gemini',
  leadsPerSearch: 10,
  kanbanColumns: ['Novo', 'Contactado', 'Proposta Enviada', 'Em Negociação', 'Fechado'],
};

/**
 * Retrieves all leads from the local storage database.
 */
export const getLeadsFromStorage = (): Lead[] => {
  try {
    const savedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!savedLeads) return [];
    return JSON.parse(savedLeads);
  } catch (error) {
    console.error("Failed to parse leads from localStorage:", error);
    return [];
  }
};

/**
 * Saves an array of leads to the local storage database.
 */
export const saveLeadsToStorage = (leads: Lead[]): void => {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error("Failed to save leads to localStorage:", error);
  }
};

/**
 * Retrieves app settings from local storage.
 */
export const getSettingsFromStorage = (): AppSettings => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!savedSettings) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Saves app settings to local storage.
 */
export const saveSettingsToStorage = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};
