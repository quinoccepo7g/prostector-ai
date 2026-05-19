
import React from 'react';
import { SearchIcon } from './Icons';

interface SearchFormProps {
  businessType: string;
  setBusinessType: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  businessType,
  setBusinessType,
  location,
  setLocation,
  handleSearch,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      handleSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-1">
            Tipo de Negócio
          </label>
          <input
            type="text"
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            placeholder="Ex: Restaurante italiano"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
            Localização
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: São Paulo, SP"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </>
          ) : (
            <>
              <SearchIcon />
              <span className="ml-2">Buscar Leads</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
