import { createContext, useContext } from 'react';

export const NBContext = createContext<NBListType | null>(null);
export const NBDispatchContext = createContext<React.Dispatch<NBDispatchAction> | null >(null);

export interface Notebook {
    id: string;
    name: string;
    parentID: string | null;
}

export interface NBListType {
    [id: string]: Notebook;
}

export interface NBDispatchAction extends Notebook {
    type: 'add' | 'delete' | 'update';
}

export function useNBs() {
    const context = useContext(NBContext);
    if (!context) {
        throw new Error('useNB must be used within an NBProvider');
    }
    return context;
}

export function useNBsDispatch() {
    const context = useContext(NBDispatchContext);
    if (!context) {
        throw new Error('useNBDispatch must be used within an NBProvider');
    }
    return context;
}
