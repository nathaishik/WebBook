import { createContext, useContext } from 'react';
import type { JSONContent } from '@tiptap/react';

export const NoteContext = createContext<NoteListType | null>(null);
export const NoteDispatchContext = createContext<React.Dispatch<NoteDispatchAction> | null >(null);

export function useNotes() {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error('useNotes must be used within an NoteProvider');
    }
    return context;
}

export function useNotesDispatch() {
    const context = useContext(NoteDispatchContext);
    if (!context) {
        throw new Error('useNotesDispatch must be used within an NoteProvider');
    }
    return context;
}

export interface Note {
    id: string;
    title: string;
    created: string;
    modified: string;
    notebookID: string;
    text: JSONContent;
}

export interface NoteListType {
    [id: string]: Note;
}

export type NoteDispatchAction =
    | { type: 'add'; note: Note; }
    | { type: 'delete'; id: string; }
    | { type: 'update'; id: string; modified: string; text: JSONContent; }
    | { type: 'update_title'; id: string; modified: string; title: string; }
    | { type: 'move'; id: string; newNotebookID: string; modified: string; }