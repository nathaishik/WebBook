import { useEffect, useReducer } from 'react';
import { usePersistentState } from './utils';
import { NBContext, NBDispatchContext } from './NBConstants';
import type { Notebook, NBListType, NBDispatchAction } from './NBConstants';

export function NBProvider({ children }: { children: React.ReactNode }) {
    const [persistedNBs, setPersistedNBs] = usePersistentState<NBListType>('notebooks', {});
    const [notebooks, dispatch] = useReducer(NBReducer, persistedNBs);

    useEffect(() => {
        setPersistedNBs(notebooks);
    }, [notebooks, setPersistedNBs]);

    return (
        <NBContext value={notebooks}>
            <NBDispatchContext value={dispatch}>
                {children}
            </NBDispatchContext>
        </NBContext>
    )
}

function NBReducer(notebooks: NBListType, action: NBDispatchAction) {
    switch (action.type) {
        case 'add': {
            if (notebooks[action.id]) {
                throw new Error(`Notebook with id ${action.id} already exists.`);
            }
            const newNB: Notebook = {
                id: action.id,
                name: action.name,
                parentID: action.parentID
            };
            return {
                ...notebooks,
                [newNB.id]: newNB
            };
        }
        case 'update': {
            if (!notebooks[action.id]) {
                throw new Error(`Notebook with id ${action.id} does not exist.`);
            }
            const updatedNB: Notebook = {
                id: action.id,
                name: action.name,
                parentID: action.parentID
            };
            return {
                ...notebooks,
                [updatedNB.id]: updatedNB
            };
        }
        case 'delete': {
            if (!notebooks[action.id]) {
                throw new Error(`Notebook with id ${action.id} does not exist.`);
            }
            const newNotebooks = { ...notebooks };
            delete newNotebooks[action.id];
            return newNotebooks;
        }
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}