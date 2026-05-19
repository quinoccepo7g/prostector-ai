import React from 'react';
import { Lead, KanbanStatus } from '../types';
import LeadCard from './LeadCard';

interface KanbanColumnProps {
  status: string;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onLeadDrop: (leadId: string, newStatus: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, leads, onLeadClick, onDeleteLead, onLeadDrop }) => {
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    onLeadDrop(leadId, status);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 w-[280px] sm:w-[320px] flex-shrink-0 flex flex-col snap-center"
    >
      <h2 className="text-white font-bold mb-4 text-center text-sm uppercase tracking-widest text-gray-400">{status} <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full text-xs ml-1">{leads.length}</span></h2>
      <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar min-h-[200px] max-h-[calc(100vh-400px)] lg:max-h-[60vh]">
        {leads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onEdit={() => onLeadClick(lead)} 
            onDelete={onDeleteLead}
          />
        ))}
        {leads.length === 0 && (
          <div className="border-2 border-dashed border-gray-700/50 rounded-xl h-24 flex items-center justify-center text-gray-600 text-xs italic">
            Arraste leads para aqui
          </div>
        )}
      </div>
    </div>
  );
};


interface KanbanBoardProps {
  leads: Lead[];
  columns: string[];
  onLeadClick: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onLeadDrop: (leadId: string, newStatus: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, columns, onLeadClick, onDeleteLead, onLeadDrop }) => {
  return (
    <div className="px-2 sm:px-4 py-8">
      <div className="flex space-x-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {columns.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            leads={leads.filter(lead => lead.status === status)}
            onLeadClick={onLeadClick}
            onDeleteLead={onDeleteLead}
            onLeadDrop={onLeadDrop}
          />
        ))}
        {columns.length === 0 && (
            <div className="text-center w-full py-12 text-gray-500 italic">
                Nenhuma coluna configurada. Vá em Configurações.
            </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
