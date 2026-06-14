import { useNotesDispatch } from "./NoteConstants";
import { useRelationsDispatch } from "./RelationsConstants";
import { v4 as uuidv4 } from 'uuid';
import type { Notebook } from "./NBConstants";
import type { Note } from "./NoteConstants";
import { NewButton } from './elements'

export function AddNote({ activeNB, setActiveNote }: { activeNB: Notebook | null, setActiveNote: React.Dispatch<React.SetStateAction<Note | null>> }) {
    const dispatchNote = useNotesDispatch();
    const dispatchRelation = useRelationsDispatch();
    if (!activeNB) {
        return (
            <NewButton disabled={true}/>
        )
    }
    function handleAddNote() {
        const nowTime = new Date().toLocaleString();
        const newNote = {
            id: uuidv4(),
            title: "New Note",
            created: nowTime,
            modified: nowTime,
            notebookID: activeNB ? activeNB.id : '',
            text: {},
        }
        dispatchNote({
            type: 'add',
            note: newNote
        })
        dispatchRelation({
            type: 'addnote',
            notebookID: activeNB ? activeNB.id : '',
            noteID: newNote.id
        })
        setActiveNote(newNote);
    }   
    return (
        <NewButton onClick={handleAddNote} />
    )
    
}