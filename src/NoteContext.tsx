import { useReducer, useEffect } from 'react';
import { usePersistentState } from './utils';
import { NoteContext, NoteDispatchContext } from './NoteConstants';
import type { Note, NoteListType, NoteDispatchAction } from './NoteConstants';

export function NotesProvider({ children }: { children: React.ReactNode }) {
    const [persistedNotes, setPersistedNotes] = usePersistentState<NoteListType>('notes', {});
    const [notes, dispatch] = useReducer(NoteReducer, persistedNotes);

    useEffect(() => {
        setPersistedNotes(notes);
    }, [notes, setPersistedNotes]);

    return (
        <NoteContext value={notes}>
            <NoteDispatchContext value={dispatch}>
                {children}
            </NoteDispatchContext>
        </NoteContext>
    )
}

function NoteReducer(notes: NoteListType, action: NoteDispatchAction): NoteListType {
    switch (action.type) {
        case 'add': {
            if (notes[action.note.id]) {
                throw new Error(`Note with id ${action.note.id} already exists.`);
            }
            const newNote: Note = {
                id: action.note.id,
                title: action.note.title,
                created: action.note.created,
                modified: action.note.modified,
                notebookID: action.note.notebookID,
                text: action.note.text
            };
            return {
                ...notes,
                [newNote.id]: newNote
            };
        }
        case 'update': {
            if (!notes[action.id]) {
                throw new Error(`Note with id ${action.id} does not exist.`);
            }
            const updatedNote: Note = {
                ...notes[action.id],
                modified: action.modified,
                text: action.text,
            };
            return {
                ...notes,
                [updatedNote.id]: updatedNote
            };
        }
        case 'update_title': {
            if (!notes[action.id]) {
                throw new Error(`Note with id ${action.id} does not exist.`);
            }
            const updatedNote: Note = {
                ...notes[action.id],
                modified: action.modified,
                title: action.title,
            }
            return {
                ...notes,
                [updatedNote.id]: updatedNote
            }
        }
        case 'move': {
            if (!notes[action.id]) {
                throw new Error(`Note with id ${action.id} does not exist.`);
            } else if (notes[action.id].notebookID === action.newNotebookID) {
                throw new Error(`Note with id ${action.id} is already in notebook with id ${action.newNotebookID}.`);
            } else {
                return {
                    ...notes,
                    [action.id]: {
                        ...notes[action.id],
                        notebookID: action.newNotebookID
                    }
                }
            }}
        case 'delete': {
            if (!notes[action.id]) {
                throw new Error(`Note with id ${action.id} does not exist.`);
            }
            const newNotes = { ...notes };
            delete newNotes[action.id];
            return newNotes;
        }
        default:
            throw new Error(`Unknown action type.`);
    }
}