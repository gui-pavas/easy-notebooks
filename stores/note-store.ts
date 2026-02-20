"use client";

import { INITIAL_SLATE_VALUE } from "@/lib/notes/slate-html";
import { NoteStoreState } from "@/types/notes";
import { create } from "zustand";

export const useNoteStore = create<NoteStoreState>((set) => ({
  noteId: null,
  loadedNoteId: null,
  title: "",
  initialValue: INITIAL_SLATE_VALUE,
  editorVersion: 0,
  content: "<p><br /></p>",
  isLoading: true,
  error: null,
  saveStatus: "idle",
  startLoading: (noteId) =>
    set({
      noteId,
      isLoading: true,
      error: null,
    }),
  hydrateNote: (noteId, title, value, content) =>
    set((state) => ({
      noteId,
      loadedNoteId: noteId,
      title,
      initialValue: value,
      content,
      isLoading: false,
      error: null,
      editorVersion: state.editorVersion + 1,
    })),
  setLoadError: (error) =>
    set({
      error,
      isLoading: false,
    }),
  setTitle: (title) =>
    set({
      title,
    }),
  setContent: (content) =>
    set({
      content,
    }),
  setSaveStatus: (saveStatus) =>
    set({
      saveStatus,
    }),
}));
