import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import KanbanBoard from './components/KanbanBoard';
import LeadDetailModal from './components/LeadDetailModal';
import SettingsModal from './components/SettingsModal';
import { findLeads } from './services/geminiService';
import { getLeadsFromStorage, saveLeadsToStorage, getSettingsFromStorage, saveSettingsToStorage } from './services/storageService';
import { Lead, KanbanStatus, AppSettings } from './types';
import { SettingsIcon } from './components/Icons';

function App() {
  const [businessType, setBusinessType] = useState('Restaurante italiano');
  const [location, setLocation] = useState('São Paulo, SP');
  
  const [leads, setLeads] = useState<Lead[]>(getLeadsFromStorage);
  const [settings, setSettings] = useState<AppSettings>(getSettingsFromStorage);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Wrapper function to update state and persist to storage
  const updateLeads = (updater: React.SetStateAction<Lead[]>) => {
    setLeads(currentLeads => {
        const newLeads = updater instanceof Function ? updater(currentLeads) : updater;
        saveLeadsToStorage(newLeads);
        return newLeads;
    });
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
    setIsSettingsOpen(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const foundLeads = await findLeads(
        businessType, 
        location, 
        settings
      );
      const newLeads: Lead[] = foundLeads.map((lead, index) => ({
        ...lead,
        id: `${Date.now()}-${index}`, // Simple unique ID
        status: settings.kanbanColumns[0] || 'Novo',
      }));
      updateLeads(prevLeads => [...newLeads, ...prevLeads]);
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };
  
  const handleDeleteLead = (leadIdToDelete: string) => {
    updateLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadIdToDelete));
    if (selectedLead && selectedLead.id === leadIdToDelete) {
      setSelectedLead(null);
    }
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    updateLeads(prevLeads => 
      prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
    );
    setSelectedLead(updatedLead); // Keep modal updated
  };
  
  const handleLeadDrop = (leadId: string, newStatus: KanbanStatus) => {
    updateLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const handleConfirmClear = () => {
    updateLeads([]);
    setIsConfirmingClear(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <header className="py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute right-4 top-8 sm:right-6 lg:right-8">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white border border-gray-700"
              title="Configurações"
            >
              <SettingsIcon />
            </button>
          </div>
          <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Prospector AI
          </h1>
          <p className="mt-2 text-center text-gray-400 max-w-2xl mx-auto">
            Encontre e gerencie leads instantaneamente com o poder da IA. Salve seu progresso e organize seu funil de vendas.
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <SearchForm
          businessType={businessType}
          setBusinessType={setBusinessType}
          location={location}
          setLocation={setLocation}
          handleSearch={handleSearch}
          isLoading={isLoading}
        />
        <div className="flex justify-end mt-4 min-h-[40px]">
            {isConfirmingClear ? (
                <div className="bg-gray-700 p-2 rounded-lg flex items-center space-x-3">
                    <p className="font-semibold text-red-300 text-sm">Tem certeza?</p>
                    <button
                        onClick={handleConfirmClear}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md transition duration-300 text-sm"
                    >
                        Sim, Limpar
                    </button>
                    <button
                        onClick={() => setIsConfirmingClear(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-md transition duration-300 text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsConfirmingClear(true)}
                    disabled={leads.length === 0 || isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm disabled:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Limpar Leads
                </button>
            )}
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        
        <KanbanBoard 
            leads={leads} 
            columns={settings.kanbanColumns}
            onLeadClick={handleLeadClick} 
            onDeleteLead={handleDeleteLead}
            onLeadDrop={handleLeadDrop}
        />

        <LeadDetailModal
          lead={selectedLead}
          columns={settings.kanbanColumns}
          onClose={handleCloseModal}
          onUpdate={handleUpdateLead}
          onDelete={handleDeleteLead}
        />

        {isSettingsOpen && (
          <SettingsModal 
            settings={settings}
            onSave={handleUpdateSettings}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </main>
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>
            © 2026. Desenvolvido por{' '}
            <a 
              href="https://vflow.digital" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              vflow.digital
            </a>
            . Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;