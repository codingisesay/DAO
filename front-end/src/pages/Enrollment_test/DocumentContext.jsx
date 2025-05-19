import React, { createContext, useContext, useState, useEffect } from 'react';

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
    const [documents, setDocuments] = useState(() => {
        // Load from localStorage if available
        const saved = localStorage.getItem('formDocuments');
        return saved ? JSON.parse(saved) : [
            { id: Date.now(), documentType: "", file: null, preview: null }
        ];
    });

    // Save to localStorage whenever documents change
    useEffect(() => {
        localStorage.setItem('formDocuments', JSON.stringify(documents));
    }, [documents]);

    const clearDocuments = () => {
        localStorage.removeItem('formDocuments');
        setDocuments([{ id: Date.now(), documentType: "", file: null, preview: null }]);
    };

    return (
        <DocumentContext.Provider value={{ documents, setDocuments, clearDocuments }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocuments = () => useContext(DocumentContext);