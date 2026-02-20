"use client";

import { Descendant, Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";

import * as React from "react";
export type SlateNoteEditorProps = {
  initialValue: Descendant[];
  editorKey: number;
  onChange: (value: Descendant[]) => void;
};

function Element({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc pl-6">
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal pl-6">
          {children}
        </ol>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "paragraph":
    default:
      return <p {...attributes}>{children}</p>;
  }
}

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  let wrappedChildren = children;

  if (leaf.bold) {
    wrappedChildren = <strong>{wrappedChildren}</strong>;
  }
  if (leaf.italic) {
    wrappedChildren = <em>{wrappedChildren}</em>;
  }
  if (leaf.underline) {
    wrappedChildren = <u>{wrappedChildren}</u>;
  }

  return <span {...attributes}>{wrappedChildren}</span>;
}

function toggleMark(editor: Editor, format: "bold" | "italic" | "underline") {
  const isActive = Editor.marks(editor)?.[format] === true;
  if (isActive) {
    Editor.removeMark(editor, format);
    return;
  }

  Editor.addMark(editor, format, true);
}

export default function SlateNoteEditor({
  initialValue,
  editorKey,
  onChange,
}: SlateNoteEditorProps) {
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = React.useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = React.useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  return (
    <Slate editor={editor} initialValue={initialValue} onValueChange={onChange} key={editorKey}>
      <div className="space-y-4">
        <div className="note-a4-pages">
          <section className="note-a4-page-shell">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              className="note-a4-editor focus:outline-none"
              onKeyDown={(event) => {
                if (!event.ctrlKey && !event.metaKey) {
                  return;
                }

                switch (event.key) {
                  case "b":
                    event.preventDefault();
                    toggleMark(editor, "bold");
                    break;
                  case "i":
                    event.preventDefault();
                    toggleMark(editor, "italic");
                    break;
                  case "u":
                    event.preventDefault();
                    toggleMark(editor, "underline");
                    break;
                  default:
                    break;
                }
              }}
            />
          </section>
        </div>
      </div>
    </Slate>
  );
}
