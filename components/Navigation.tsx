import React from 'react';
import { IdentificationMethod } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface NavigationProps {
    activeMethod: IdentificationMethod;
    onMethodChange: (method: IdentificationMethod) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeMethod, onMethodChange }) => {
    const { t } = useLanguage();
    
    const methods = [
        { id: IdentificationMethod.Packaging, label: t("navigation.packaging") },
        { id: IdentificationMethod.Name, label: t("navigation.nameSearch") },
        { id: IdentificationMethod.Chatbot, label: t("navigation.chatbot") }
    ];

    return (
        <nav className="flex justify-center gap-2 sm:gap-4 my-8">
            {methods.map(method => (
                <button
                    key={method.id}
                    className={`px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-900 ${
                        activeMethod === method.id 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                    onClick={() => onMethodChange(method.id)}
                >
                    {method.label}
                </button>
            ))}
        </nav>
    );
};

export default Navigation;