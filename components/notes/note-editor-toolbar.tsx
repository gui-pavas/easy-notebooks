"use client";

import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";
import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlate } from "slate-react";

type MarkFormat = "bold" | "italic" | "underline";
type ListFormat = "bulleted-list" | "numbered-list";

const LIST_TYPES: ListFormat[] = ["bulleted-list", "numbered-list"];

function isMarkActive(editor: Editor, format: MarkFormat): boolean {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function toggleMark(editor: Editor, format: MarkFormat) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
    return;
  }

  Editor.addMark(editor, format, true);
}

function isBlockActive(editor: Editor, format: ListFormat): boolean {
  const [match] = Editor.nodes(editor, {
    match: (node) => !Editor.isEditor(node) && SlateElement.isElement(node) && node.type === format,
  });

  return Boolean(match);
}

function toggleList(editor: Editor, format: ListFormat) {
  const isActive = isBlockActive(editor, format);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      LIST_TYPES.includes(node.type as ListFormat),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : "list-item",
  });

  if (!isActive) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });
  }
}

export default function NoteEditorToolbar() {
  const editor = useSlate();
  const isBold = isMarkActive(editor, "bold");
  const isItalic = isMarkActive(editor, "italic");
  const isUnderline = isMarkActive(editor, "underline");
  const isBulleted = isBlockActive(editor, "bulleted-list");
  const isNumbered = isBlockActive(editor, "numbered-list");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 rounded bg-background p-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isBold ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, "bold");
          }}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isItalic ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, "italic");
          }}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isUnderline ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, "underline");
          }}
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-7 w-px bg-border" />

      <div className="flex items-center gap-1 rounded-md border bg-background p-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isBulleted ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleList(editor, "bulleted-list");
          }}
          aria-label="Bulleted list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isNumbered ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleList(editor, "numbered-list");
          }}
          aria-label="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
