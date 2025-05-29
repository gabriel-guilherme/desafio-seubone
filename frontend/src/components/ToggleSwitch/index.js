import React from 'react';
import './index.css';

const ToggleSwitch = ({ checked = 2, onChange }) => {
  const isLigado = checked === 1;

  const handleClick = () => {
    const novoValor = isLigado ? 2 : 1;
    if (onChange) {
      onChange(novoValor);
    }
  };

  const containerClasses = `toggle-switch-container ${isLigado ? 'ligado' : ''}`;

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      role="switch"
      aria-checked={isLigado}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className="toggle-switch-circle"></div>
    </div>
  );
};

export default ToggleSwitch;
