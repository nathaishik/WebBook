import { useState } from "react";
import { useNBsDispatch } from "./NBConstants";
import { useNotesDispatch } from "./NoteConstants";
import { useRelations, useRelationsDispatch } from "./RelationsConstants";
import { useNBs } from "./NBConstants";
import type { Notebook } from "./NBConstants";

import { BarList, BarListItem, Icon } from './elements'

export function NBList({
  activeNB,
  setActiveNB,
}: {
  activeNB: Notebook | null;
  setActiveNB: React.Dispatch<React.SetStateAction<Notebook | null>>;
}) {
  const notebooksDict = useNBs();
  const notebooks = Object.values(notebooksDict);
  return (
    <BarList>
      {notebooks.map((notebook) => (
        <BarListItem
          key={notebook.id}
          isActive={activeNB?.id === notebook.id ? true : false}
        >
          <NBItem notebook={notebook} setActiveNB={setActiveNB} />
        </BarListItem>
      ))}
    </BarList>
  );
}

function NBItem({
  notebook,
  setActiveNB,
}: {
  notebook: Notebook;
  setActiveNB: React.Dispatch<React.SetStateAction<Notebook | null>>;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [clearNotes, setClearNotes] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(notebook.name);
  const dispatchNB = useNBsDispatch();
  const dispatchRelations = useRelationsDispatch();
  const dispatchNotes = useNotesDispatch();
  const Relations = useRelations();

  function handleNBClick() {
    setActiveNB(notebook);
  }

  let notebookContent;
  if (isEditing) {
    function sendNBEditDispatch() {
      dispatchNB({
        type: "update",
        ...notebook,
        name: editedName,
      });
      setIsEditing(false);
    }
    function cancelNBEdit() {
      setEditedName(notebook.name);
      setIsEditing(false);
    }
    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter") {
        sendNBEditDispatch();
      } else if (e.key === "Escape") {
        cancelNBEdit();
      }
    }
    notebookContent = (
      <>
        
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyUp={handleKeyPress}
          autoFocus
        />
        <button onClick={sendNBEditDispatch}><Icon icon="check" /></button>
        <button onClick={cancelNBEdit}><Icon icon="close" /></button>
      </>
    );
  } else if (isDeleting) {
    notebookContent = (
      <>
        <label htmlFor={notebook.id}>
          <input
          id={notebook.id}
          type="checkbox"
          checked={clearNotes}
          onChange={() => setClearNotes(!clearNotes)}
        />
          Delete Notes</label>
        <button
          onClick={() => {
            dispatchNB({ type: "delete", ...notebook });
            if (clearNotes) {
              Relations[notebook.id]?.forEach((noteID) => {
                dispatchNotes({ type: "delete", id: noteID });
                dispatchRelations({
                  type: "deletenote",
                  notebookID: notebook.id,
                  noteID,
                });
              });
            }
            dispatchRelations({
              type: "deletenotebook",
              notebookID: notebook.id,
            });
            setIsDeleting(false);
          }}
        >
          <Icon icon="delete" />
        </button>
        <button onClick={() => {setClearNotes(false); setIsDeleting(false)}}><Icon icon="close"/></button>
      </>
    );
  } else {
    notebookContent = (
      <>
        <span onClick={handleNBClick}>{notebook.name}</span>
        <button onClick={() => setIsEditing(true)}><Icon icon="edit"/></button>
        <button
          onClick={() => {
            setIsDeleting(true);
          }}
        >
          <Icon icon="delete"/>
        </button>
      </>
    );
  }

  return notebookContent;
}
