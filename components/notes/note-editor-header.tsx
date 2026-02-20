"use client";

import NoteEditorToolbar from "@/components/notes/note-editor-toolbar";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";

export type NoteEditorHeaderProps = {
  title: string;
  onTitleChange: (value: string) => void;
  statusText: string;
};

export default function NoteEditorHeader({ title, onTitleChange, statusText }: NoteEditorHeaderProps) {
  return (
    <header className="w-full h-auto absolute top-0 left-0 z-50 bg-background border-b border-border px-4 py-2">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center max-w-sm border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-sm">
          <Input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Note title"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <span
            className="px-3 py-2 flex items-center justify-center bg-accent text-accent-foreground rounded-r-md transition-colors"
          >
            <PencilIcon className="w-4 h-4 text-muted-foreground" />
          </span>
        </div>
        <p className="text-muted-foreground text-xs whitespace-nowrap">{statusText}</p>
      </div>
      <div className="justify-self-end">
        <NoteEditorToolbar />
      </div>
    </header>
  );
}
