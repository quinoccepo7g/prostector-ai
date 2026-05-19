
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative animate-in zoom-in duration-300 border border-gray-700/50 my-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-gray-900/50 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all z-10"
        >
          <XIcon />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
          Configurações
        </h2>

        <div className="space-y-8">
          {/* Provedor selection */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Provedor de IA</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => setLocalSettings({...localSettings, preferredProvider: 'gemini'})}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    localSettings.preferredProvider === 'gemini' 
                    ? 'border-blue-500 bg-blue-500/10 text-white' 
                    : 'border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span className="font-bold">Google Gemini</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${localSettings.preferredProvider === 'gemini' ? 'border-blue-500' : 'border-gray-600'}`}>
                    {localSettings.preferredProvider === 'gemini' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </button>
                <button 
                  onClick={() => setLocalSettings({...localSettings, preferredProvider: 'openai'})}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    localSettings.preferredProvider === 'openai' 
                    ? 'border-green-500 bg-green-500/10 text-white' 
                    : 'border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span className="font-bold">OpenAI</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${localSettings.preferredProvider === 'openai' ? 'border-green-500' : 'border-gray-600'}`}>
                    {localSettings.preferredProvider === 'openai' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                  </div>
                </button>
            </div>

            <div className="mt-6">
              {localSettings.preferredProvider === 'gemini' ? (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase ml-1">Gemini API Key</label>
                    <input
                      type="password"
                      value={localSettings.geminiApiKey}
                      onChange={(e) => setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })}
                      placeholder="Chave do Google AI Studio"
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase ml-1">Modelo de IA</label>
                    <select
                      value={localSettings.geminiModel}
                      onChange={(e) => setLocalSettings({ ...localSettings, geminiModel: e.target.value as any })}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    >
                      <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Grátis e Rápido)</option>
                      <option value="gemini-3-flash-preview">Gemini 3 Flash (Padrão)</option>
                      <option value="gemini-flash-latest">Gemini 2.0 Flash (Última versão)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase ml-1">OpenAI API Key</label>
                    <input
                      type="password"
                      value={localSettings.openaiApiKey || ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, openaiApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase ml-1">ID do Modelo</label>
                    <input
                      type="text"
                      value={localSettings.openaiModel || 'gpt-4o-mini'}
                      onChange={(e) => setLocalSettings({ ...localSettings, openaiModel: e.target.value })}
                      placeholder="gpt-4o-mini"
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Search Settings */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Configurações de Busca</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase ml-1">Leads por Busca</label>
              <input
                type="number"
                min="1"
                max="30"
                value={localSettings.leadsPerSearch}
                onChange={(e) => setLocalSettings({ ...localSettings, leadsPerSearch: parseInt(e.target.value) || 1 })}
                className="w-full sm:w-32 bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
              <p className="mt-2 text-[10px] text-gray-500 italic ml-1">Recomendado: 5-15 leads por vez para melhor precisão.</p>
            </div>
          </section>

          {/* Kanban Columns */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Fluxo de Vendas (Kanban)</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {localSettings.kanbanColumns.map((col, index) => (
                  <div key={col} className="bg-gray-900/50 border border-gray-700 rounded-xl py-2 pl-2 pr-3 flex items-center space-x-2 group hover:border-gray-600 transition-colors">
                    <div className="flex flex-col">
                        <button onClick={() => moveColumn(index, 'up')} className="text-gray-600 hover:text-blue-400 transition-colors">
                            <ChevronUpIcon className="h-3 w-3" />
                        </button>
                        <button onClick={() => moveColumn(index, 'down')} className="text-gray-600 hover:text-blue-400 transition-colors">
                            <ChevronDownIcon className="h-3 w-3" />
                        </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-200">{col}</span>
                    <button 
                        onClick={() => handleRemoveColumn(col)}
                        className="text-gray-600 hover:text-red-400 transition-colors ml-1"
                        disabled={localSettings.kanbanColumns.length <= 1}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={newColumn}
                  onChange={(e) => setNewColumn(e.target.value)}
                  placeholder="Nova coluna..."
                  className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                />
                <button
                  onClick={handleAddColumn}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-white transition-colors text-sm sm:text-base order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(localSettings)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] text-sm sm:text-base order-1 sm:order-2"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
