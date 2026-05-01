// src/components/PasswordInput.jsx (Nuevo componente)
import { useState } from 'react';

export default function PasswordInput({ label, name, value, onChange, placeholder, disabled = false }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          className="field-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={name === 'password' ? 'new-password' : 'current-password'}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
    </div>
  );
}