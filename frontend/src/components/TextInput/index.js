import React from 'react';

import './index.css';

const TextInput = ({ label, name, value, onChange, disabled, placeholder = '', type = 'text' }) => {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default TextInput;