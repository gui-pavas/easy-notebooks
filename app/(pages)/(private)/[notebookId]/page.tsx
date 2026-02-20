"use client";

import NoteGrid from "@/components/notes/note-grid";
import { Button } from "@/components/ui/button";
import type { NoteCardData } from "@/components/notes/note-card";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

export default function NotebookNotesPage() {
  const params = useParams<{ notebookId: string }>();
  const router = useRouter();
  const notebookId = params.notebookId;

  const [notes, setNotes] = React.useState<NoteCardData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreatingNote, setIsCreatingNote] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNotes = React.useCallback(async () => {
    if (!notebookId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to load notes.");
      }

      const data: NoteCardData[] = await response.json();
      const notebookNotes = data.filter((note) => note.notebookId === notebookId);
      setNotes(notebookNotes);
    } catch {
      setError("Could not load notes right now.");
    } finally {
      setIsLoading(false);
    }
  }, [notebookId]);

  React.useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  const createNote = async () => {
    if (!notebookId || isCreatingNote) {
      return;
    }

    setIsCreatingNote(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notebookId,
          title: "Untitled Note",
          content: "<p></p>",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const createdNote: NoteCardData = await response.json();
      router.push(`/${notebookId}/notes/${createdNote.id}`);
    } catch {
      setError("Could not create a new note.");
    } finally {
      setIsCreatingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">Open a note card to edit it on its own page.</p>
        <Button onClick={createNote} disabled={isCreatingNote}>
          {isCreatingNote ? "Creating..." : "New Note"}
        </Button>
      </div>

      {isLoading && <p>Loading notes...</p>}
      {!isLoading && error && <p>{error}</p>}
      {!isLoading && !error && <NoteGrid notes={notes} />}
    </div>
  );
}
