import { useState } from "react";
import { StorageContext, type StorageSettingsValue } from "./StorageConstants";
import type { StorageSettings } from "./StorageConstants";
import { STORAGE_KEY } from "./StorageConstants";
import { analyseLocalStorage } from "./utils";

export function StorageProvider({ children }: { children: React.ReactNode }) {
    const [storage, setStorage] = useState<StorageSettings>(() => {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        if (!storedValue) {
            localStorage.clear();
            const availableSize:string[] = analyseLocalStorage("occupied");
            const totalSize:string[] = analyseLocalStorage("total");
            return {
                current: availableSize,
                total: totalSize,
            } as StorageSettings;
        }

        try {
            return JSON.parse(storedValue) as StorageSettings;
        } catch {
            return {
                current: ["0", "0"],
                total: ["0", "0"],
            } as StorageSettings;
        }
    })

    function clearStorage() {
        localStorage.clear();
        const totalSize:string[] = analyseLocalStorage("total");
        const availableSize:string[] = analyseLocalStorage("occupied");
        const nextSettings: StorageSettings = {
            current: availableSize,
            total: totalSize,
        }
        setStorage(nextSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
    }

    function refreshStorage() {
        const availableSize:string[] = analyseLocalStorage("occupied");
        const updatedSettings: StorageSettings = {
            current: availableSize,
            total: storage.total,
        }
        setStorage(updatedSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
       
    }

    const value: StorageSettingsValue = {
        storage,
        clearStorage,
        refreshStorage,
    }

    return <StorageContext value={value}>{children}</StorageContext>
}