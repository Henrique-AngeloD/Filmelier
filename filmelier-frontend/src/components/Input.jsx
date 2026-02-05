import React from 'react';

const Input = ({ label, type, placeholder, value, onChange, required, disabled }) => {
    return (
        <div className="mb-4">
            <label className="block text-text-secondary text-sm font-inter mb-2">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="w-full bg-gray-850 border border-gray-700 text-text-primary rounded-lg p-3 focus:outline-none focus:border-primary-500 transition-colors placeholder-gray-600 disabled:opacity-50"
            />
        </div>
    );
};

export default Input;