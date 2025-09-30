
import React from 'react';
import ImageIdentifier from './common/ImageIdentifier';

const BarcodeScanner: React.FC = () => {
    const prompt = "Identify the medication from this barcode. Provide its name, active ingredients, dosage, and common uses. If the image is not a barcode or you cannot identify it, state that.";
    
    return (
        <ImageIdentifier
            title="Identify by Barcode"
            description="Upload a clear photo of the barcode on the medication's packaging."
            prompt={prompt}
        />
    );
};

export default BarcodeScanner;
