import { useState, useEffect } from "react";
import { StorageContext, type StorageSettingsValue } from "./StorageConstants";
import type { StorageSettings } from "./StorageConstants";
import { STORAGE_KEY } from "./StorageConstants";
import { analyseLocalStorage } from "./utils";

export function StorageProvider({ children }: { children: React.ReactNode }) {
    // 1. Synchronous State Initialization
    const [storage, setStorage] = useState<StorageSettings>(() => {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        if (storedValue) {
            try {
                return JSON.parse(storedValue) as StorageSettings;
            } catch {
                return { current: ["0", "0"], total: ["0", "0"] } as StorageSettings;
            }
        }
        // Provide a safe default for the very first synchronous render
        return { current: ["0", "0"], total: ["0", "0"] } as StorageSettings;
    });

    // 2. Asynchronous Setup on Mount
    useEffect(() => {
        async function initializeStorage() {
            const storedValue = localStorage.getItem(STORAGE_KEY);
            if (!storedValue) {
                localStorage.clear();
                
                // Now await works because we are inside an async function
                const availableSize: string[] = await analyseLocalStorage("occupied");
                const totalSize: string[] = await analyseLocalStorage("total");
                
                const initialSettings: StorageSettings = {
                    current: availableSize,
                    total: totalSize,
                };
                
                setStorage(initialSettings);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSettings));
            }
        }

        initializeStorage();
    }, []); // Empty dependency array ensures this runs only once on mount

    // 3. Make handlers async to await the Promise
    async function clearStorage() {
        localStorage.clear();
        
        const totalSize: string[] = await analyseLocalStorage("total");
        const availableSize: string[] = await analyseLocalStorage("occupied");
        
        const nextSettings: StorageSettings = {
            current: availableSize,
            total: totalSize,
        };
        
        setStorage(nextSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
    }

    async function refreshStorage() {
        const availableSize: string[] = await analyseLocalStorage("occupied");
        
        const updatedSettings: StorageSettings = {
            current: availableSize,
            total: storage.total,
        };
        
        setStorage(updatedSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    }

    const value: StorageSettingsValue = {
        storage,
        clearStorage,
        refreshStorage,
    };

    return <StorageContext value={value}>{children}</StorageContext>;
}