
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { XIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from './Icons';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [newColumn, setNewColumn] = useState('');

  const handleAddColumn = () => {
    if (newColumn && !localSettings.kanbanColumns.includes(newColumn)) {
      setLocalSettings({
        ...localSettings,
        kanbanColumns: [...localSettings.kanbanColumns, newColumn]
      });
      setNewColumn('');
    }
  };

  const handleRemoveColumn = (col: string) => {
    setLocalSettings({
      ...localSettings,
      kanbanColumns: localSettings.kanbanColumns.filter(c => c !== col)
    });
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newCols = [...localSettings.kanbanColumns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newCols.length) {
      [newCols[index], newCols[targetIndex]] = [newCols[targetIndex], newCols[index]];
      setLocalSettings({ ...localSettings, kanbanColumns: newCols });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <XIcon />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Configurações do Prospector
        </h2>

        <div className="space-y-6">
          {/* API Keys */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Provedor e API Keys</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-6 p-3 bg-gray-700/30 rounded-lg">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="provider" 
                        checked={localSettings.preferredProvider === 'gemini'} 
                        onChange={() => setLocalSettings({...localSettings, preferredProvider: 'gemini'})}
                        className="text-blue-500 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className={localSettings.preferredProvider === 'gemini' ? "text-white font-bold" : "text-gray-400"}>Google Gemini</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="provider" 
                        checked={localSettings.preferredProvider === 'openai'} 
                        onChange={() => setLocalSettings({...localSettings, preferredProvider: 'openai'})}
                        className="text-blue-500 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className={localSettings.preferredProvider === 'openai' ? "text-white font-bold" : "text-gray-400"}>OpenAI</span>
                  </label>
              </div>

              {localSettings.preferredProvider === 'gemini' ? (
                <div className="space-y-4 animate-in slide-in-from-left-2 duration-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Gemini API Key</label>
                    <input
                      type="password"
                      value={localSettings.geminiApiKey}
                      onChange={(e) => setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })}
                      placeholder="Chave do Google AI Studio"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Modelo Gemini</label>
                    <select
                      value={localSettings.geminiModel}
                      onChange={(e) => setLocalSettings({ ...localSettings, geminiModel: e.target.value as any })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Mais rápido e novo)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Mais estável / Maior quota)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-2 duration-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">OpenAI API Key</label>
                    <input
                      type="password"
                      value={localSettings.openaiApiKey || ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, openaiApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Modelo OpenAI</label>
                    <input
                      type="text"
                      value={localSettings.openaiModel || 'gpt-4o-mini'}
                      onChange={(e) => setLocalSettings({ ...localSettings, openaiModel: e.target.value })}
                      placeholder="gpt-4o-mini"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Search Settings */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Busca</h3>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Leads por Busca</label>
              <input
                type="number"
                min="1"
                max="30"
                value={localSettings.leadsPerSearch}
                onChange={(e) => setLocalSettings({ ...localSettings, leadsPerSearch: parseInt(e.target.value) || 1 })}
                className="w-32 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </section>

          {/* Kanban Columns */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Colunas do Kanban</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {localSettings.kanbanColumns.map((col, index) => (
                  <div key={col} className="bg-gray-700 rounded-lg py-2 px-3 flex items-center space-x-2 group">
                    <div className="flex flex-col">
                        <button onClick={() => moveColumn(index, 'up')} className="text-gray-500 hover:text-blue-400 transition-colors">
                            <ChevronUpIcon className="h-3 w-3" />
                        </button>
                        <button onClick={() => moveColumn(index, 'down')} className="text-gray-500 hover:text-blue-400 transition-colors">
                            <ChevronDownIcon className="h-3 w-3" />
                        </button>
                    </div>
                    <span className="text-sm font-medium">{col}</span>
                    <button 
                        onClick={() => handleRemoveColumn(col)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        disabled={localSettings.kanbanColumns.length <= 1}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newColumn}
                  onChange={(e) => setNewColumn(e.target.value)}
                  placeholder="Nova coluna..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                />
                <button
                  onClick={handleAddColumn}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(localSettings)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md font-bold shadow-lg transition-all"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
