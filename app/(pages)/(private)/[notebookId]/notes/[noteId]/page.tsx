"use client";

import SlateNoteEditor from "@/components/notes/slate-note-editor";
import { useNotes } from "@/hooks/use-notes";
import { useParams } from "next/navigation";

export default function NotePage() {
  const params = useParams<{ notebookId: string; noteId: string }>();
  const noteId = params.noteId;
  const {
    initialValue,
    editorVersion,
    onEditorChange,
    isLoading,
    error,
  } = useNotes(noteId);

  return (
    <div className="space-y-4">
      {isLoading && <p>Loading note...</p>}
      {!isLoading && error && <p>{error}</p>}

      {!isLoading && !error && (
        <div className="w-full">
          <SlateNoteEditor
            initialValue={initialValue}
            editorKey={editorVersion}
            onChange={onEditorChange}
          />
        </div>
      )}
    </div>
  );
}
