"use client";

import { deserializeHtmlToSlate, serializeSlateToHtml } from "@/lib/notes/slate-html";
import { useNoteStore } from "@/stores/note-store";
import { Note, UseNotesResult } from "@/types/notes";
import { Descendant } from "slate";
import * as React from "react";

export function useNotes(noteId: string): UseNotesResult {
  const websocketRef = React.useRef<WebSocket | null>(null);

  const title = useNoteStore((state) => state.title);
  const initialValue = useNoteStore((state) => state.initialValue);
  const editorVersion = useNoteStore((state) => state.editorVersion);
  const content = useNoteStore((state) => state.content);
  const isLoading = useNoteStore((state) => state.isLoading);
  const error = useNoteStore((state) => state.error);
  const saveStatus = useNoteStore((state) => state.saveStatus);
  const loadedNoteId = useNoteStore((state) => state.loadedNoteId);
  const startLoading = useNoteStore((state) => state.startLoading);
  const hydrateNote = useNoteStore((state) => state.hydrateNote);
  const setLoadError = useNoteStore((state) => state.setLoadError);
  const setTitle = useNoteStore((state) => state.setTitle);
  const setContent = useNoteStore((state) => state.setContent);
  const setSaveStatus = useNoteStore((state) => state.setSaveStatus);

  const saveOverHttp = React.useCallback(
    async (nextTitle: string, nextContent: string) => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: nextTitle,
          content: nextContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setSaveStatus("saved");
    },
    [noteId, setSaveStatus],
  );

  React.useEffect(() => {
    if (!noteId) {
      setLoadError("Note id is missing.");
      return;
    }

    if (loadedNoteId === noteId) {
      return;
    }

    const fetchNote = async () => {
      startLoading(noteId);

      try {
        const response = await fetch(`/api/notes/${noteId}`);
        if (!response.ok) {
          throw new Error("Failed to load note.");
        }

        const note: Note = await response.json();
        const parsedValue = deserializeHtmlToSlate(note.content);
        hydrateNote(noteId, note.title, parsedValue, serializeSlateToHtml(parsedValue));
      } catch {
        setLoadError("Could not load this note right now.");
      }
    };

    void fetchNote();
  }, [hydrateNote, loadedNoteId, noteId, setLoadError, startLoading]);

  React.useEffect(() => {
    let isClosed = false;

    const connect = async () => {
      try {
        await fetch("/api/notes/autosave-socket");
      } catch {
        // Continue and attempt websocket connection even if bootstrap fails.
      }

      if (isClosed) {
        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const socket = new WebSocket(`${protocol}://${window.location.host}/api/notes/autosave-socket`);
      websocketRef.current = socket;

      socket.onopen = () => {
        setSaveStatus("idle");
      };

      socket.onmessage = (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as { type?: string };
          if (data.type === "saved") {
            setSaveStatus("saved");
          }
          if (data.type === "error") {
            setSaveStatus("error");
          }
        } catch {
          setSaveStatus("error");
        }
      };

      socket.onerror = () => {
        setSaveStatus("error");
      };

      socket.onclose = () => {
        if (!isClosed) {
          window.setTimeout(connect, 1200);
        }
      };
    };

    void connect();

    return () => {
      isClosed = true;
      websocketRef.current?.close();
      websocketRef.current = null;
    };
  }, [setSaveStatus]);

  const performSave = React.useCallback(
    async (nextTitle: string, nextContent: string) => {
      if (nextTitle.trim().length === 0) {
        return;
      }

      setSaveStatus("saving");
      const message = JSON.stringify({
        type: "autosave",
        noteId,
        title: nextTitle,
        content: nextContent,
      });

      const socket = websocketRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        return;
      }

      try {
        await saveOverHttp(nextTitle, nextContent);
      } catch {
        setSaveStatus("error");
      }
    },
    [noteId, saveOverHttp, setSaveStatus],
  );

  React.useEffect(() => {
    if (!noteId || isLoading) {
      return;
    }

    const timer = window.setTimeout(() => {
      void performSave(title, content);
    }, 600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [content, isLoading, noteId, performSave, title]);

  const editorStatusText =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "error"
          ? "Save failed"
          : "Idle";

  const onEditorChange = React.useCallback((nextValue: Descendant[]) => {
    setContent(serializeSlateToHtml(nextValue));
  }, [setContent]);

  return {
    title,
    setTitle,
    initialValue,
    editorVersion,
    onEditorChange,
    isLoading,
    error,
    editorStatusText,
  };
}
