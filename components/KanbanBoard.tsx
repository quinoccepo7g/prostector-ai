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
      className="bg-gray-800/50 rounded-lg p-4 w-72 md:w-80 flex-shrink-0"
    >
      <h2 className="text-white font-semibold mb-4 text-center">{status} ({leads.length})</h2>
      <div className="space-y-4 h-[60vh] overflow-y-auto pr-2">
        {leads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onEdit={() => onLeadClick(lead)} 
            onDelete={onDeleteLead}
          />
        ))}
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
    <div className="px-4 py-8">
      <div className="flex space-x-4 overflow-x-auto pb-4">
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
