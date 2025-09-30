
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-5">
            <div className="w-9 h-9 border-4 border-zinc-200 dark:border-zinc-600 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Spinner;
