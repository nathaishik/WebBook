import { useReducer, useEffect } from 'react';
import { usePersistentState } from './utils';
import { RelationContext, RelationDispatchContext } from './RelationsConstants';
import type { Relation, RelationDispatchAction } from './RelationsConstants';

export function RelationsProvider({ children }: { children: React.ReactNode }) {
    const [persistedRelations, setPersistedRelations] = usePersistentState<Relation>('Relations', {});
    const [Relations, dispatch] = useReducer(RelationReducer, persistedRelations);

    useEffect(() => {
        setPersistedRelations(Relations);
    }, [Relations, setPersistedRelations]);

    return (
        <RelationContext value={Relations}>
            <RelationDispatchContext value={dispatch}>
                {children}
            </RelationDispatchContext>
        </RelationContext>
    )
}

function RelationReducer(Relations: Relation, action: RelationDispatchAction): Relation {
    switch (action.type) {
        case 'addnote': {
            if (Relations[action.notebookID]) {
                return {
                    ...Relations,
                    [action.notebookID]: [...Relations[action.notebookID], action.noteID]
                };
            } else {
                throw new Error(`Notebook with id ${action.notebookID} does not exist.`);
            }
        }
        case 'addnotebook': {
            if (Relations[action.notebookID]) {
                throw new Error(`Notebook with id ${action.notebookID} already exists.`);
            } else {
                return {
                    ...Relations,
                    [action.notebookID]: []
                };
            }
        }
        case 'movenote': {
            if (!Relations[action.prevNotebookID]) {
                throw new Error(`Previous notebook with id ${action.prevNotebookID} does not exist.`);
            } else if (!Relations[action.newNotebookID]) {
                throw new Error(`New notebook with id ${action.newNotebookID} does not exist.`);
            } else if (!Relations[action.prevNotebookID].find(id => id === action.noteID)) {
                throw new Error(`Note with id ${action.noteID} does not exist in notebook with id ${action.prevNotebookID}.`);
            } else {
                return {
                    ...Relations,
                    [action.prevNotebookID]: Relations[action.prevNotebookID].filter(id => id !== action.noteID),
                    [action.newNotebookID]: [...Relations[action.newNotebookID], action.noteID]
                };
            }
        }
        case 'deletenote': {
            if (!Relations[action.notebookID]) {
                throw new Error(`Notebook with id ${action.notebookID} does not exist.`);
            } else if (!Relations[action.notebookID].find(id => id === action.noteID)) {
                throw new Error(`Note with id ${action.noteID} does not exist in notebook with id ${action.notebookID}.`);
            } else {
                return {
                    ...Relations,
                    [action.notebookID]: Relations[action.notebookID].filter(id => id !== action.noteID)
                };
            }
        }
        case 'deletenotebook': {
            if (!Relations[action.notebookID]) {
                throw new Error(`Notebook with id ${action.notebookID} does not exist.`);
            } else {
                const newRelations = { ...Relations };
                delete newRelations[action.notebookID];
                return newRelations;
            }
        }
        default:
            throw new Error(`Unknown action type.`);
    }
}