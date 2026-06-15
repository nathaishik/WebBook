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

export async function analyseLocalStorage(mode: "total" | "occupied"): Promise<string[]> {
    switch (mode) {
        case "total": {
            // Returns the promise directly without stringifying it
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

    async function calculateTotalSize(): Promise<string[]> {
        if (localStorage.length === 0) {
            localStorage.clear(); 
            let data = "X";
            let totalAllocated = 0;

            while (data.length < 102400) { data += data; } 

            // Return the Promise directly
            return new Promise<string[]>((resolve) => {
                function fillLoop() {
                    try {
                        localStorage.setItem(`test_chunk_${totalAllocated}`, data);
                        totalAllocated += data.length;
                        setTimeout(fillLoop, 0); 
                    } catch (e) {
                        console.log(e);
                        localStorage.clear();
                        const total = (totalAllocated * 2);
                        resolve([convertBytesToReadableSize(total), total.toString()]);
                    }
                }
                fillLoop();
            });
        } else {
            throw new Error("Storage not empty.");
        }
    }
}