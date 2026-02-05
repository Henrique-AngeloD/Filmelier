import React from 'react';

const Button = ({ text, onClick, type = "button", disabled, loading = false, className = "" }) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                w-full 
                bg-primary-500 hover:bg-primary-600 
                text-gray-900 font-bold font-montserrat 
                py-3 px-6 rounded-lg 
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-primary-500/20
                cursor-pointer
                ${className}
            `}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                </span>
            ) : text}
        </button>
    );
};

export default Button;