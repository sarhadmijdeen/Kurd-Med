import React from 'react';
import ImageIdentifier from './common/ImageIdentifier';
import { useLanguage } from '../hooks/useLanguage';

const PackagingScanner: React.FC = () => {
    const { t } = useLanguage();
    const prompt = t('packagingScanner.prompt');

    return (
        <div className="bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-2xl shadow-lg transition-colors">
            <ImageIdentifier
                title={t('packagingScanner.title')}
                description={t('packagingScanner.description')}
                prompt={prompt}
            />
        </div>
    );
};

export default PackagingScanner;