import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface OnboardingTourProps {
    step: number;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ step, onNext, onPrev, onClose }) => {
    const { t } = useLanguage();

    const tourSteps = [
        {
            title: t("onboarding.step1.title"),
            content: t("onboarding.step1.content"),
        },
        {
            title: t("onboarding.step2.title"),
            content: t("onboarding.step2.content"),
        },
        {
            title: t("onboarding.step3.title"),
            content: t("onboarding.step3.content"),
        },
        {
            title: t("onboarding.step4.title"),
            content: t("onboarding.step4.content"),
        },
         {
            title: t("onboarding.step5.title"),
            content: t("onboarding.step5.content"),
        },
    ];

    const currentStep = tourSteps[step];
    if (!currentStep) return null;

    const isLastStep = step === tourSteps.length - 1;
    const isFirstStep = step === 0;

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-500">{currentStep.title}</h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{currentStep.content}</p>

                <div className="mt-6 flex justify-center gap-3">
                    {!isFirstStep && (
                        <button onClick={onPrev} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">
                            {t('onboarding.buttons.previous')}
                        </button>
                    )}
                    {!isLastStep && <button onClick={onNext} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">{t('onboarding.buttons.next')}</button>}
                    {isLastStep && <button onClick={onClose} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">{t('onboarding.buttons.finish')}</button>}
                </div>

                {!isLastStep && <button className="mt-4 text-sm text-zinc-500 hover:underline" onClick={onClose}>{t('onboarding.buttons.skip')}</button>}
            </div>
        </div>
    );
};

export default OnboardingTour;