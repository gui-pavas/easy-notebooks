"use client";

import { useNotes } from "@/hooks/use-notes";
import { UseNotesResult } from "@/types/notes";
import * as React from "react";

type NoteEditorContextValue = UseNotesResult;

const NoteEditorContext = React.createContext<NoteEditorContextValue | null>(null);

export function NoteEditorProvider({
  noteId,
  children,
}: {
  noteId: string;
  children: React.ReactNode;
}) {
  const notesState = useNotes(noteId);

  return <NoteEditorContext.Provider value={notesState}>{children}</NoteEditorContext.Provider>;
}

export function useNoteEditorContext() {
  const context = React.useContext(NoteEditorContext);
  if (!context) {
    throw new Error("useNoteEditorContext must be used inside NoteEditorProvider.");
  }

  return context;
}
