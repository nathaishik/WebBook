import { createContext, useContext } from 'react';

export const RelationContext = createContext<Relation | null>(null);
export const RelationDispatchContext = createContext<React.Dispatch<RelationDispatchAction> | null >(null);

export function useRelations() {
    const context = useContext(RelationContext);
    if (!context) {
        throw new Error('useRelations must be used within an RelationProvider');
    }
    return context;
}

export function useRelationsDispatch() {
    const context = useContext(RelationDispatchContext);
    if (!context) {
        throw new Error('useRelationsDispatch must be used within an RelationProvider');
    }
    return context;
}

export type Relation = {
    [id: string]: string[];
};

export type RelationDispatchAction =
    | { type: 'addnote'; notebookID: string; noteID: string; }
    | { type: 'addnotebook'; notebookID: string; }
    | { type: 'movenote'; prevNotebookID: string; newNotebookID: string; noteID: string; }
    | { type: 'deletenote'; notebookID: string; noteID: string; }
    | { type: 'deletenotebook'; notebookID: string; };
