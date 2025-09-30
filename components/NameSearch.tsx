import React, { useState, useCallback } from 'react';
import { identifyWithName } from '../services/geminiService';
import { PillInfo } from '../types';
import PillInfoCard from './common/PillInfoCard';
import Spinner from './common/Spinner';
import { useLanguage } from '../hooks/useLanguage';

const NameSearch: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pillInfo, setPillInfo] = useState<PillInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t, language } = useLanguage();

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) {
            setError(t('nameSearch.error.enterName'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setPillInfo(null);

        try {
            const prompt = t('nameSearch.prompt', { name });
            const result = await identifyWithName(name, prompt, language);
            setPillInfo(result);
        } catch (err) {
            setError(t('nameSearch.error.unexpected'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [name, t, language]);

    return (
        <div className="bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-2xl shadow-lg transition-colors">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">{t('nameSearch.title')}</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('nameSearch.description')}</p>
            
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('nameSearch.placeholder')}
                    disabled={isLoading}
                    className="flex-grow w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !name.trim()}
                    className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-zinc-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-zinc-800 transition-all"
                >
                    {isLoading ? t('nameSearch.button.searching') : t('nameSearch.button.search')}
                </button>
            </form>

            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}

            <div className="mt-6">
                {isLoading && <Spinner />}
                {pillInfo && <PillInfoCard pillInfo={pillInfo} />}
            </div>
        </div>
    );
};

export default NameSearch;