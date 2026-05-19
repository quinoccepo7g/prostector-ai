import React, { useState } from 'react';
import { Lead } from '../types';
import { LocationMarkerIcon, PhoneIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from './Icons';

interface LeadCardProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('leadId', lead.id);
  };

  const handleDeleteRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(lead.id);
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  }

  return (
    <div
      draggable={!isConfirmingDelete}
      onDragStart={handleDragStart}
      onClick={onEdit}
      className="bg-gray-800 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:bg-gray-700 transition-colors duration-200 group"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-white truncate pr-2 flex-1">{lead.companyName}</h3>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
           {isConfirmingDelete ? (
            <>
              <span className="text-xs text-red-300">Excluir?</span>
              <button onClick={handleConfirmDelete} className="text-gray-400 hover:text-green-400">
                  <CheckIcon className="h-4 w-4" />
              </button>
              <button onClick={handleCancelDelete} className="text-gray-400 hover:text-red-400">
                  <XIcon className="h-4 w-4" />
              </button>
            </>
           ) : (
            <>
              <button onClick={handleEdit} className="text-gray-400 hover:text-blue-400">
                  <PencilIcon className="h-4 w-4" />
              </button>
              <button onClick={handleDeleteRequest} className="text-gray-400 hover:text-red-400">
                  <TrashIcon className="h-4 w-4" />
              </button>
            </>
           )}
        </div>
      </div>

      <div className="text-gray-400 mt-2 flex items-center text-sm">
        <LocationMarkerIcon className="h-4 w-4 flex-shrink-0" />
        <p className="ml-2 truncate">{lead.address}</p>
      </div>
      {lead.phone && (
         <div className="text-gray-400 mt-1 flex items-center text-sm">
            <PhoneIcon className="h-4 w-4 flex-shrink-0" />
            <p className="ml-2">{lead.phone}</p>
        </div>
      )}
    </div>
  );
};

export default LeadCard;