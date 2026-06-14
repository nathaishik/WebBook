import { useState } from 'react';
import { useNotesDispatch } from './NoteConstants';
import { useRelations, useRelationsDispatch } from './RelationsConstants';
import { useNBs } from './NBConstants';
import type { Note } from './NoteConstants';
import { useNotes } from './NoteConstants';
import type { Notebook } from './NBConstants';

import { BarList, BarListItem, Icon } from './elements'

export function NoteList({ activeNB, setActiveNB, activeNote, setActiveNote }: { activeNB: Notebook | null, setActiveNB: React.Dispatch<React.SetStateAction<Notebook | null>>, activeNote: Note | null, setActiveNote: React.Dispatch<React.SetStateAction<Note | null>> }) {
    const Relations = useRelations();
    const notesArray:string[] = Relations[activeNB?.id || ''] || [];
    const allNotes = useNotes();
    if (activeNB === null) {
        return <div>Please select a notebook.</div>;
    }
    const notes = notesArray.map(noteID => allNotes[noteID]);
    return (
        <BarList>
            {notes.map(note => (
                <BarListItem key={note.id} isActive={activeNote?.id === note.id ? true: false}>
                    <NoteItem note={note} setActiveNote={setActiveNote} setActiveNB={setActiveNB} />
                </BarListItem>
            ))}
        </BarList>
    )
}

function NoteItem({ note, setActiveNote, setActiveNB }: { note: Note , setActiveNote: React.Dispatch<React.SetStateAction<Note | null>>, setActiveNB: React.Dispatch<React.SetStateAction<Notebook | null>> }) {
    const dispatchRelations = useRelationsDispatch();
    const dispatchNotes = useNotesDispatch();
    const Notebooks = useNBs();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [movingTo, setMovingTo] = useState<string>(note.notebookID);

    let noteContent;
    if (isDeleting) {
        noteContent = (
            <>
                <span>Are you sure?</span>
                <button
                    onClick={() => {
                        dispatchNotes({
                            type: 'delete',
                            id: note.id
                        });
                        dispatchRelations({
                            type: 'deletenote',
                            notebookID: note.notebookID,
                            noteID: note.id
                        })
                    }}
                >
                    <Icon icon="delete" />
                </button>
                <button onClick={() => setIsDeleting(false)}><Icon icon="close" /></button>
            </>
        )
    } else if (isMoving) {
        noteContent = (
            <>
                <label htmlFor={note.id}>To: 
                    <select id={note.id} defaultValue={note.notebookID} onChange={e => setMovingTo(e.target.value)}>
                        <option value={note.notebookID} disabled>{Notebooks[note.notebookID].name}</option>
                        {
                            Object.keys(Notebooks).filter(notebookID => notebookID !== note.notebookID).map(notebookID => {
                                return (
                                    <option key={notebookID} value={notebookID}>
                                        {Notebooks[notebookID].name}
                                    </option>
                                )
                            })
                        }
                    </select>

                </label>
                <button disabled={movingTo === note.notebookID} onClick={() => {
                    if (movingTo === note.notebookID) {
                        setIsMoving(false)
                        return;
                    };
                    dispatchNotes({
                        type: 'move',
                        id: note.id,
                        newNotebookID: movingTo,
                        modified: new Date().toLocaleString()
                    });
                    dispatchRelations({
                        type: 'movenote',
                        prevNotebookID: note.notebookID,
                        newNotebookID: movingTo,
                        noteID: note.id
                    });
                    setActiveNB(Notebooks[movingTo]);
                    setIsMoving(false);
                }}>
                    <Icon icon="check" />
                </button>
                <button onClick={() => {
                    setIsMoving(false);
                    setMovingTo(note.notebookID);
                }}>
                    <Icon icon="close" />
                </button>
            </>
        )
    } else {
        noteContent = (
            <>
                <span onClick={() => setActiveNote(note)}>{note.title}</span>
                <button onClick={() => setIsMoving(true)}><Icon icon="shift" /></button> 
                <button onClick={() => setIsDeleting(true)}><Icon icon="delete"/></button>
            </>
        )
    }

    return noteContent;
}