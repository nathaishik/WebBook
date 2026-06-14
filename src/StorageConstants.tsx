import { createContext, useContext } from "react";

export interface StorageSettings {
    current: string[];
    total: string[];
}

export type StorageSettingsValue = {
    storage: StorageSettings;
    clearStorage: () => void;
    refreshStorage: () => void;
};

export const STORAGE_KEY = "notebook_storage";

export const StorageContext = createContext<StorageSettingsValue | null>(null);

export function useStorage() {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
}