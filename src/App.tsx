import "./App.css";
import "./Blob.css";
import { AddNB } from "./AddNB";
import { AddNote } from "./AddNote";
import { NBList } from "./NBList";
import { NoteList } from "./NoteList";
import { ViewNote } from "./ViewNote";
import { AppProvider } from "./AppContext";

import { Blob } from "./blob";

import type { Notebook } from "./NBConstants";
import type { Note } from "./NoteConstants";
import { useState } from "react";

import { Bar, BarHeading, EmptyPage } from "./elements";

import { SettingsButton, SettingsPanel } from "./Settings";

function App() {
  const [activeNB, setActiveNB] = useState<Notebook | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  return (
    <AppProvider>
      <Blob />
      <SettingsButton onClick={() => {setIsSettingsOpen(!isSettingsOpen)}} />
      <SettingsPanel isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />
      <div className="app">
        <div className="sidebar">
          <Bar barName="notebook-bar">
            <BarHeading title="Notebooks">
              <AddNB setActiveNB={setActiveNB} />
            </BarHeading>
            <NBList activeNB={activeNB} setActiveNB={setActiveNB} />
          </Bar>
          {activeNB !== null ? (
            <Bar barName="notes-bar">
              <BarHeading title="Notes">
                <AddNote activeNB={activeNB} setActiveNote={setActiveNote} />
              </BarHeading>
              <NoteList
                activeNB={activeNB}
                setActiveNB={setActiveNB}
                activeNote={activeNote}
                setActiveNote={setActiveNote}
              />
            </Bar>
          ) : null}
        </div>
        {activeNB === null || activeNote === null ? (
          <EmptyPage message="Please select a notebook and note to view." />
        ) : null}
        {activeNote !== null ? (
          <div className="view-notes">
            <ViewNote note={activeNote} key={activeNote?.id} />
          </div>
        ) : null}
      </div>
    </AppProvider>
  );
}

export default App;
