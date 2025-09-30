
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

const Auth: React.FC = () => {
    const { signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            // onAuthStateChanged will handle successful login and component will unmount.
        } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled. Please try again.');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked by browser. Please allow popups for this site and try again.');
            } else {
                setError(err.message || 'An unexpected error occurred during sign-in.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 px-4 transition-colors duration-300">
            <div className="max-w-sm w-full text-center p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700">
                <div className="mx-auto flex items-center justify-center h-16 w-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-emerald-600 dark:text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </div>
                <h1 className="mt-6 text-3xl font-bold text-zinc-800 dark:text-zinc-100">{t('header.title')}</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">Please sign in to continue.</p>
                
                {error && (
                     <p className="mt-6 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg text-start">{error}</p>
                )}

                <div className="mt-8">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 border border-zinc-300 dark:border-zinc-600 rounded-lg font-semibold text-zinc-700 dark:text-zinc-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-wait"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.222,0-9.658-3.344-11.303-7.962l-6.573,4.817C9.656,39.663,16.318,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238	C42.022,35.319,44,30.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                                <span>Sign in with Google</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
