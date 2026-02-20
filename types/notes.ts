import { Descendant } from "slate";

export type Note = {
  id: string;
  notebookId: string;
  title: string;
  content: string;
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type NoteStoreState = {
  noteId: string | null;
  loadedNoteId: string | null;
  title: string;
  initialValue: Descendant[];
  editorVersion: number;
  content: string;
  isLoading: boolean;
  error: string | null;
  saveStatus: SaveStatus;
  startLoading: (noteId: string) => void;
  hydrateNote: (noteId: string, title: string, value: Descendant[], content: string) => void;
  setLoadError: (error: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSaveStatus: (status: SaveStatus) => void;
};

export type UseNotesResult = {
  title: string;
  setTitle: (title: string) => void;
  initialValue: Descendant[];
  editorVersion: number;
  onEditorChange: (value: Descendant[]) => void;
  isLoading: boolean;
  error: string | null;
  editorStatusText: string;
};
