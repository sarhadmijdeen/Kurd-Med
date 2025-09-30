import React from 'react';
import { PillInfo } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface PillInfoCardProps {
    pillInfo: PillInfo | null;
}

const PillInfoCard: React.FC<PillInfoCardProps> = ({ pillInfo }) => {
    const { t } = useLanguage();

    if (!pillInfo) {
        return null;
    }

    const renderFailureCard = (title: string, message: string) => (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border-s-4 border-red-500 rounded-e-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ms-3">
                    <h3 className="text-md font-medium text-red-800 dark:text-red-300">{title}</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!pillInfo.name && pillInfo.rawText?.includes("error")) {
        return renderFailureCard(t('pillInfoCard.error.apiTitle'), pillInfo.rawText);
    }
    
    // Updated failure logic to check for empty name or description-based failure from the new prompt
    if (!pillInfo.name || (pillInfo.description && pillInfo.description.toLowerCase().includes('fail'))) {
        const message = pillInfo.description || t('pillInfoCard.error.failMessage');
        return renderFailureCard(t('pillInfoCard.error.failTitle'), message);
    }

    const renderListSection = (title: string, items: string[] | undefined, icon: React.ReactNode) => {
        if (!items || items.length === 0) return null;
        return (
            <div>
                <h4 className="flex items-center text-lg font-semibold text-zinc-700 dark:text-zinc-200">
                    {icon}
                    <span className="ms-2">{title}</span>
                </h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-zinc-600 dark:text-zinc-400">
                    {items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        );
    };

    return (
        <div className="p-6 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-6">
            <header>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{pillInfo.name}</h3>
                {pillInfo.description && <p className="mt-1 text-zinc-600 dark:text-zinc-400">{pillInfo.description}</p>}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderListSection(t('pillInfoCard.uses'), pillInfo.uses, 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                {renderListSection(t('pillInfoCard.sideEffects'), pillInfo.sideEffects, 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                )}
            </div>
            
            {pillInfo.dosage && (
                 <div>
                    <h4 className="flex items-center text-lg font-semibold text-zinc-700 dark:text-zinc-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <span className="ms-2">{t('pillInfoCard.dosage')}</span>
                    </h4>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">{pillInfo.dosage}</p>
                </div>
            )}
             {pillInfo.activeIngredients && pillInfo.activeIngredients.length > 0 && (
                 <div>
                    <h4 className="flex items-center text-lg font-semibold text-zinc-700 dark:text-zinc-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00.547-1.806z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="ms-2">{t('pillInfoCard.activeIngredients')}</span>
                    </h4>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">{pillInfo.activeIngredients.join(', ')}</p>
                </div>
            )}
            
            {pillInfo.disclaimer && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-s-4 border-yellow-400 rounded-e-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                             <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.22 3.008-1.742 3.008H4.42c-1.522 0-2.492-1.674-1.742-3.008l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ms-3">
                            <h4 className="text-md font-medium text-yellow-800 dark:text-yellow-300">{t('pillInfoCard.disclaimer')}</h4>
                            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">{pillInfo.disclaimer}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PillInfoCard;