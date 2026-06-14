import { useEffect, useState } from 'react'

// Hook to manage state that exists in localStorage

export function usePersistentState<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            return JSON.parse(storedValue) as T;
        } else {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}

export function analyseLocalStorage(mode: "total" | "occupied") : string[] {
    switch (mode) {
        case "total": {
            return calculateTotalSize();
        }
        case "occupied": {
            const availableSize = JSON.stringify(localStorage).length * 2;
            return [convertBytesToReadableSize(availableSize), availableSize.toString()];
        }
        default: {
            throw new Error("Invalid mode.");
        }
    }

    function convertBytesToReadableSize(bytes: number) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return size.toFixed(2) + ' ' + units[unitIndex];
    }


    function calculateTotalSize() {
        if (localStorage.length === 0) {
            let data = "0";
            while (true) {
                try {
                    localStorage.setItem('DATA', data);
                    data = data + data;
                } catch (error) {
                    const maxSize = JSON.stringify(localStorage).length;
                    // JS strings are UTF-16 encoded, so each character takes 2 bytes
                    localStorage.removeItem('DATA');
                    const readableSize = convertBytesToReadableSize(maxSize * 2);
                    console.log(error);
                    return [readableSize, (maxSize * 2).toString()];
                }
            }
        } else {
            throw new Error("Storage not empty.");
        }
    }
}