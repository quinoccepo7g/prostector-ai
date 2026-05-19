import React, { useState, useEffect } from 'react';
import { Lead, KanbanStatus } from '../types';
import { GlobeIcon, LocationMarkerIcon, MailIcon, PhoneIcon, XIcon, WhatsappIcon, InstagramIcon, FacebookIcon, TrashIcon } from './Icons';

interface LeadDetailModalProps {
  lead: Lead | null;
  columns: string[];
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
  onDelete: (id: string) => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; href?: string; children: React.ReactNode }> = ({ icon, href, children }) => {
    const content = <div className="flex items-center space-x-3 text-gray-300">{icon}{children}</div>;
    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors shrink-0">{content}</a>
    }
    return content;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, columns, onClose, onUpdate, onDelete }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    // Reset confirmation state when modal opens for a new lead
    if (lead) {
      setIsConfirmingDelete(false);
    }
  }, [lead]);

  if (!lead) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...lead, status: e.target.value as KanbanStatus });
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate({ ...lead, notes: e.target.value });
  }
  
  const cleanPhoneNumber = (phone: string) => phone.replace(/\D/g, '');

  const ensureHttps = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleDeleteRequest = () => {
    setIsConfirmingDelete(true);
  }

  const handleConfirmDelete = () => {
    onDelete(lead.id);
  }

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg text-white relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XIcon />
        </button>

        <h2 className="text-3xl font-bold mb-1">{lead.companyName}</h2>
        <p className="text-gray-400 mb-6">{lead.contactName || 'Contato não especificado'}</p>
        
        <div className="space-y-4">
            <InfoRow icon={<LocationMarkerIcon />}>
                <span>{lead.address}</span>
            </InfoRow>
            {lead.phone && (
                 <InfoRow icon={<PhoneIcon />} href={`tel:${cleanPhoneNumber(lead.phone)}`}>
                    <span>{lead.phone}</span>
                </InfoRow>
            )}
             {lead.whatsapp && (
                 <InfoRow icon={<WhatsappIcon />} href={`https://wa.me/${cleanPhoneNumber(lead.whatsapp)}`}>
                    <span>{lead.whatsapp}</span>
                </InfoRow>
            )}
            {lead.email && (
                <InfoRow icon={<MailIcon />} href={`mailto:${lead.email}`}>
                    <span>{lead.email}</span>
                </InfoRow>
            )}
            {lead.website && (
                <InfoRow icon={<GlobeIcon />} href={ensureHttps(lead.website)}>
                    <span className="truncate">{lead.website}</span>
                </InfoRow>
            )}
            {lead.instagram && (
                <InfoRow icon={<InstagramIcon />} href={ensureHttps(lead.instagram)}>
                    <span className="truncate">{lead.instagram.split('/').pop() || lead.instagram}</span>
                </InfoRow>
            )}
            {lead.facebook && (
                 <InfoRow icon={<FacebookIcon />} href={ensureHttps(lead.facebook)}>
                    <span className="truncate">{lead.facebook.split('/').pop() || lead.facebook}</span>
                </InfoRow>
            )}
        </div>
        
        <div className="mt-8">
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Status
            </label>
            <select
                id="status"
                value={lead.status}
                onChange={handleStatusChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {columns.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
        </div>

        <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                Anotações
            </label>
            <textarea
                id="notes"
                rows={4}
                value={lead.notes || ''}
                onChange={handleNotesChange}
                placeholder="Adicione anotações sobre este lead..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4">
            {isConfirmingDelete ? (
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="font-semibold mb-3">Tem certeza que deseja excluir este lead?</p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={handleConfirmDelete} 
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Sim, Excluir
                        </button>
                        <button 
                            onClick={handleCancelDelete} 
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleDeleteRequest}
                    className="w-full flex items-center justify-center bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold py-2 px-4 rounded-md transition duration-300"
                >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Excluir Lead
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;