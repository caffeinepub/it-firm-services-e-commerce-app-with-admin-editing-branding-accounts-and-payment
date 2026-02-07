import { useState, useEffect } from 'react';
import { useGetSiteBranding } from './useBranding';

const LANGUAGE_STORAGE_KEY = 'preferred-language';

export function useLanguagePreference() {
    const { data: branding } = useGetSiteBranding();
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');

    useEffect(() => {
        if (!branding?.languageConfig) return;

        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const availableLanguages = branding.languageConfig.availableLanguages || [];
        const defaultLanguage = branding.languageConfig.defaultLanguage || '';

        // Check if saved language is still valid
        const isValidSavedLanguage = savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage);

        if (isValidSavedLanguage) {
            setSelectedLanguage(savedLanguage);
        } else if (defaultLanguage) {
            setSelectedLanguage(defaultLanguage);
            if (savedLanguage) {
                // Clear invalid saved language
                localStorage.removeItem(LANGUAGE_STORAGE_KEY);
            }
        } else if (availableLanguages.length > 0) {
            setSelectedLanguage(availableLanguages[0].code);
        }
    }, [branding]);

    const changeLanguage = (languageCode: string) => {
        setSelectedLanguage(languageCode);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    };

    return {
        selectedLanguage,
        changeLanguage,
        availableLanguages: branding?.languageConfig?.availableLanguages || [],
        defaultLanguage: branding?.languageConfig?.defaultLanguage || ''
    };
}
