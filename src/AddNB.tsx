import { useNBsDispatch } from "./NBConstants";
import { useRelationsDispatch } from "./RelationsConstants";
import { v4 as uuidv4 } from 'uuid';
import type { Notebook } from "./NBConstants";
import { NewButton } from './elements'

export function AddNB({setActiveNB}: {setActiveNB: React.Dispatch<React.SetStateAction<Notebook | null>>}) {
    const dispatchNB = useNBsDispatch();
    const dispatchRelation = useRelationsDispatch();

    function handleAddNB() {
        const newNB = {
            id: uuidv4(),
            name: "New Notebook",
            parentID: null
        }
        dispatchNB({
            type: 'add',
            ...newNB
        })
        dispatchRelation({
            type: 'addnotebook',
            notebookID: newNB.id
        })
        setActiveNB(newNB);
    }

    return (
        <NewButton onClick={handleAddNB} />
    )
}