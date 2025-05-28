import React, { useState } from 'react';
import './index.css';

const ToggleSwitch = ({ valorInicial = 1, onChange }) => {
  const [valorAtual, setValorAtual] = useState(valorInicial);

  const handleClick = () => {
    const novoValor = valorAtual === 1 ? 2 : 1;
    setValorAtual(novoValor);
    if (onChange) {
      onChange(novoValor);
    }
  };

  const containerClasses = `toggle-switch-container ${valorAtual === 2 ? 'ligado' : ''}`;

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      role="switch"
      aria-checked={valorAtual === 2}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className="toggle-switch-circle"></div>
    </div>
  );
};

export default ToggleSwitch;
