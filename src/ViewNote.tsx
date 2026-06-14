import { useEffect, useState, useRef } from "react";
import { useNotesDispatch } from "./NoteConstants";
import type { Note } from "./NoteConstants";
import Tiptap from "./Tiptap";
import type { JSONContent } from "@tiptap/react";
import { useNBs } from "./NBConstants";
import { Icon } from "./elements";

export function ViewNote({ note }: { note: Note | null }) {
    const Notebooks = useNBs();
    if (!note) {
        return <div>No note selected.</div>;
    }
    return (
        <>
            <div>
                <p className="notebook-name"><Icon icon="book_2" />{Notebooks[note.notebookID].name}</p>
                <TitleComponent note={note} />
                <NoteMetaComponent note={note}/>
            </div>
            <NoteContentComponent note={note}/>
        </>
    )
}

function NoteContentComponent({note}: {note: Note}) {
    // const [title, setTitle] = useState<string>(note ? note.title : "");
    // const ref = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);
    const dispatch = useNotesDispatch();

    // useEffect(() => {
    //     if (ref.current && note.id && ref.current.textContent !== note.text) {
    //         ref.current.textContent = note.text;
    //         ref.current.focus();
    //         const range = document.createRange();
    //         range.selectNodeContents(ref.current);
            
    //         // 3. Collapse the range boundaries directly to the end (false)
    //         range.collapse(false);

    //         // 4. Update the active browser layout selection
    //         const selection = window.getSelection();
    //         if (selection) {
    //             selection.removeAllRanges();
    //             selection.addRange(range);
    //         }
    //     }
    // }, [note.id, note.text])

    function handleInput(value: JSONContent) {
        if (!note) return;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            dispatch({
                type: 'update',
                id: note.id,
                modified: new Date().toLocaleString(),
                text: value
            })
        }, 500);
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
    })

    if (!note) return null;

    return (
        // <div contentEditable={true} onInput={handleInput} ref={ref}></div>
        <Tiptap key={note.id} text={note.text} onChange={handleInput} />
    )
}

function NoteMetaComponent({note}: {note: Note}) {
    return (
        <div className="note-meta">
            <span>Created on:</span> {note.created} &middot; <span>Last changed:</span> {note.modified}
        </div>
    )
}

function TitleComponent({note}: {note: Note}) {
    const [title, setTitle] = useState<string>(note ? note.title : "");
    const dispatch = useNotesDispatch();

    useEffect(() => {
        if (note.id && note.title !== title) {
            const updateTextID = setTimeout(() => {
                dispatch(
                    {
                        type: 'update_title',
                        modified: new Date().toLocaleString(),
                        title: title,
                        id: note.id
                    }
                )
            }, 500);
            return () => clearTimeout(updateTextID);
        }
    }, [title, dispatch, note.id, note.title])
    return (
        <input className="note-title" type="text" value={title} onChange={
            e => {
                setTitle(e.target.value || "");
            }
        } />
    )
}

