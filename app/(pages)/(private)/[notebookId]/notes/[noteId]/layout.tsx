"use client";
import NoteEditorHeader from "@/components/notes/note-editor-header";
import { useNotes } from "@/hooks/use-notes";
import { useParams } from "next/navigation";
import * as React from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";

export default function NoteEditorLayout({
  onTitleChange,
  children,
  statusText
}: {
  onTitleChange: (value: string) => void;
  statusText: string;
  children: React.ReactNode;
}) {
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);

  const params = useParams<{ notebookId: string; noteId: string }>();
  const noteId = params.noteId;
  const {
    title,
    initialValue,
    onEditorChange,
    editorStatusText,
    editorVersion,
  } = useNotes(noteId);

  return (
    <div className="w-full h-full">
      <Slate editor={editor} initialValue={initialValue} onChange={onEditorChange} key={editorVersion}>
        <NoteEditorHeader title={title} onTitleChange={onTitleChange} statusText={editorStatusText} />
      </Slate>
      <main>{children}</main>
    </div>
  );
}
