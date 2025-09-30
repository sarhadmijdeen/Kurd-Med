import React, { useState, useCallback } from 'react';
import { identifyWithImage } from '../../services/geminiService';
import { PillInfo } from '../../types';
import PillInfoCard from './PillInfoCard';
import Spinner from './Spinner';
import { useLanguage } from '../../hooks/useLanguage';

interface ImageIdentifierProps {
    title: string;
    description: string;
    prompt: string;
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const ImageIdentifier: React.FC<ImageIdentifierProps> = ({ title, description, prompt }) => {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pillInfo, setPillInfo] = useState<PillInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t, language } = useLanguage();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
            setPillInfo(null);
            setError(null);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!file) {
            setError(t('imageIdentifier.error.selectImage'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setPillInfo(null);

        try {
            const base64Image = await toBase64(file);
            const result = await identifyWithImage(base64Image, file.type, prompt, language);
            setPillInfo(result);
        } catch (err) {
            setError(t('imageIdentifier.error.unexpected'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [file, prompt, t, language]);

    return (
        <div className="image-identifier">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">{title}</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>

            <div className="mt-6 p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-center">
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                <label htmlFor="file-upload" className="cursor-pointer text-emerald-600 dark:text-emerald-500 font-semibold hover:underline">
                    {t('imageIdentifier.chooseFile')}
                </label>
                <span className="text-zinc-500">{t('imageIdentifier.dragAndDrop')}</span>
                {image && <img src={image} alt={t('imageIdentifier.previewAlt')} className="mt-4 max-h-60 mx-auto rounded-lg shadow-md" />}
            </div>

            <div className="mt-6">
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !file}
                    className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-zinc-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-zinc-800 transition-all"
                >
                    {isLoading ? t('imageIdentifier.button.analyzing') : t('imageIdentifier.button.identify')}
                </button>
            </div>

            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
            
            <div className="mt-6">
                {isLoading && <Spinner />}
                {pillInfo && <PillInfoCard pillInfo={pillInfo} />}
            </div>
        </div>
    );
};

export default ImageIdentifier;