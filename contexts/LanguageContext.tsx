
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, replacements?: { [key: string]: string }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [translations, setTranslations] = useState<{ [key in Language]?: any }>({});
    const [language, setLanguageState] = useState<Language>(() => {
        const storedLang = localStorage.getItem('language');
        if (storedLang === 'en' || storedLang === 'ku') {
            return storedLang;
        }
        const browserLang = navigator.language.split('-')[0];
        return browserLang === 'ku' ? 'ku' : 'en';
    });

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const [enRes, kuRes] = await Promise.all([
                    fetch('./locales/en.json'),
                    fetch('./locales/ku.json')
                ]);
                const enData = await enRes.json();
                const kuData = await kuRes.json();
                setTranslations({ en: enData, ku: kuData });
            } catch (error) {
                console.error('Failed to load translations:', error);
            }
        };
        loadTranslations();
    }, []);

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ku' ? 'rtl' : 'ltr';
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = useCallback((key: string, replacements?: { [key: string]: string }): string => {
        const langTranslations = translations[language];
        if (!langTranslations || Object.keys(langTranslations).length === 0) {
            return key; // Return key if translations aren't loaded yet
        }

        const keys = key.split('.');
        let result = langTranslations;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        
        if (typeof result === 'string' && replacements) {
            Object.keys(replacements).forEach(placeholder => {
                result = result.replace(`{${placeholder}}`, replacements[placeholder]);
            });
        }

        return result || key;
    }, [language, translations]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};