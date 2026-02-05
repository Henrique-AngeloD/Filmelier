import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        // Overlay Escuro (Fundo)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            
            {/* Janela do Modal */}
            <div className="bg-gray-850 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
                
                {/* Cabeçalho */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-montserrat font-bold text-primary-500">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Conteúdo (Scrollável se for muito grande) */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;