
import React, { useState, useEffect } from 'react';
import { IdentificationMethod } from './types';
import { useLanguage } from './hooks/useLanguage';
import { useAuth } from './hooks/useAuth';

import Header from './components/Header';
import Navigation from './components/Navigation';
import PackagingScanner from './components/PackagingScanner';
import NameSearch from './components/NameSearch';
import AiChatbot from './components/AiChatbot';
import OnboardingTour from './components/OnboardingTour';
import Auth from './components/Auth';
import Spinner from './components/common/Spinner';

const App: React.FC = () => {
    const { user, loading } = useAuth();
    const [activeMethod, setActiveMethod] = useState<IdentificationMethod>(IdentificationMethod.Packaging);
    const [showTour, setShowTour] = useState<boolean>(false);
    const [tourStep, setTourStep] = useState<number>(0);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        if (user) { // Only check for tour if user is logged in
            const hasSeenTour = localStorage.getItem('kurdMedOnboardingComplete');
            if (!hasSeenTour) {
                setShowTour(true);
            }
        }
    }, [user]);

     useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ku' : 'en');
    };

    const handleCloseTour = () => {
        setShowTour(false);
        localStorage.setItem('kurdMedOnboardingComplete', 'true');
    };

    const handleNextStep = () => {
        setTourStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setTourStep(prev => prev - 1);
    };

    const renderActiveComponent = () => {
        switch (activeMethod) {
            case IdentificationMethod.Packaging:
                return <PackagingScanner />;
            case IdentificationMethod.Name:
                return <NameSearch />;
            case IdentificationMethod.Chatbot:
                return <AiChatbot />;
            default:
                return <PackagingScanner />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return <Auth />;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
                {showTour && (
                    <OnboardingTour
                        step={tourStep}
                        onNext={handleNextStep}
                        onPrev={handlePrevStep}
                        onClose={handleCloseTour}
                    />
                )}
                <Header toggleTheme={toggleTheme} currentTheme={theme} toggleLanguage={toggleLanguage} />
                <Navigation activeMethod={activeMethod} onMethodChange={setActiveMethod} />
                <main className="mt-8">
                    {renderActiveComponent()}
                </main>
            </div>
        </div>
    );
};

export default App;