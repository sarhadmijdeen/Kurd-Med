import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
    toggleTheme: () => void;
    currentTheme: string;
    toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, currentTheme, toggleLanguage }) => {
    const { t, language } = useLanguage();
    const { user, signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Effect to handle clicks outside of the user menu to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        try {
            await signOut();
            setMenuOpen(false);
        } catch (error) {
            console.error("Error signing out:", error);
            setIsLoggingOut(false); // Reset on error
        }
    };

    return (
        <header className="flex justify-between items-center pb-6 border-b border-zinc-200 dark:border-zinc-700">
            <div className="text-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                    {t('header.title')}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('header.tagline')}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-900 transition-colors"
                    aria-label={t('theme.toggle')}
                >
                    {currentTheme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </button>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>
                    {menuOpen && (
                         <div className="absolute end-0 mt-2 w-64 origin-top-right bg-white dark:bg-zinc-800 rounded-lg shadow-xl border dark:border-zinc-700 z-10 transition-all duration-150 ease-out"
                            style={{ transform: menuOpen ? 'scale(1)' : 'scale(0.95)', opacity: menuOpen ? 1 : 0 }}
                         >
                            <div className="p-4 border-b dark:border-zinc-700">
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Signed in as</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={() => { toggleLanguage(); setMenuOpen(false); }}
                                    className="w-full text-start flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 13l4-4M19 5h-4M3 19h12M9 17v2M13 13L9 17" /></svg>
                                    <span>{t('language.toggle')} ({language === 'en' ? 'KU' : 'EN'})</span>
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    disabled={isLoggingOut}
                                    className="w-full text-start flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing Out...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            <span>Sign Out</span>
                                        </>
                                    )}
                                </button>
                            </div>
                         </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;