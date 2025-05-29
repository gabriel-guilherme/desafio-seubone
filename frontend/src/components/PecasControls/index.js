import React, { useState } from 'react';

import './index.css';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"> 
    <path d="M22.375 8.25H2.125C1.82663 8.25 1.54048 8.13147 1.3295 7.9205C1.11853 7.70952 1 7.42337 1 7.125C1 6.82663 1.11853 6.54048 1.3295 6.3295C1.54048 6.11853 1.82663 6 2.125 6H22.375C22.6734 6 22.9595 6.11853 23.1705 6.3295C23.3815 6.54048 23.5 6.82663 23.5 7.125C23.5 7.42337 23.3815 7.70952 23.1705 7.9205C22.9595 8.13147 22.6734 8.25 22.375 8.25ZM18.625 13.5H5.875C5.57663 13.5 5.29048 13.3815 5.0795 13.1705C4.86853 12.9595 4.75 12.6734 4.75 12.375C4.75 12.0766 4.86853 11.7905 5.0795 11.5795C5.29048 11.3685 5.57663 11.25 5.875 11.25H18.625C18.9234 11.25 19.2095 11.3685 19.4205 11.5795C19.6315 11.7905 19.75 12.0766 19.75 12.375C19.75 12.6734 19.6315 12.9595 19.4205 13.1705C19.2095 13.3815 18.9234 13.5 18.625 13.5ZM14.125 18.75H10.375C10.0766 18.75 9.79048 18.6315 9.5795 18.4205C9.36853 18.2095 9.25 17.9234 9.25 17.625C9.25 17.3266 9.36853 17.0405 9.5795 16.8295C9.79048 16.6185 10.0766 16.5 10.375 16.5H14.125C14.4234 16.5 14.7095 16.6185 14.9205 16.8295C15.1315 17.0405 15.25 17.3266 15.25 17.625C15.25 17.9234 15.1315 18.2095 14.9205 18.4205C14.7095 18.6315 14.4234 18.75 14.125 18.75Z" fill="#070707"/>
  </svg>
);

export default function PecasControls({ pecasData = [], onTabChange, onSearchChange, onSearchSubmit, onFilterClick, initialActiveTab = 'todos' }) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [searchTerm, setSearchTerm] = useState('');

  const pecasAtivas = pecasData.filter(peca => peca.status === 1).length;
  const pecasExpiradas = pecasData.filter(peca => peca.status === 2).length;
  const totalPecas = pecasData.length;

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };

  const handleSearchButtonClick = () => {
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  const handleFilterButtonClick = () => {
    if (onFilterClick) {
      //console.log("FOI")
      onFilterClick();
    }
  };

  return (
    <div className="pecas-controls">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => handleTabClick('todos')}
        >
          Todos ({totalPecas})
        </button>
        <button
          className={`tab-button ${activeTab === 'ativos' ? 'active' : ''}`}
          onClick={() => handleTabClick('ativos')}
        >
          Ativos ({pecasAtivas})
        </button>
        <button
          className={`tab-button ${activeTab === 'expirados' ? 'active' : ''}`}
          onClick={() => handleTabClick('expirados')}
        >
          Expirado ({pecasExpiradas})
        </button>
      </div>
      <div className="actions">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button
          className="action-button search-button"
          aria-label="Pesquisar"
          onClick={handleSearchButtonClick}
        >
          <SearchIcon />
        </button>
        <button
          className="action-button filter-button"
          aria-label="Filtros"
          onClick={handleFilterButtonClick}
        >
          <FilterIcon />
        </button>
      </div>
    </div>
  );
};

