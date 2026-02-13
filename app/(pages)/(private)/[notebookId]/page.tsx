'use client';

import { useParams } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Note = {
    id: string;
    notebookId: string;
    title: string;
    content: string;
    updatedAt?: string;
};

export default function NotebookPage() {
    const params = useParams<{ notebookId: string }>();
    const notebookId = params.notebookId;
    const editorRef = React.useRef<HTMLDivElement | null>(null);
    const websocketRef = React.useRef<WebSocket | null>(null);

    const [notes, setNotes] = React.useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [isCreatingNote, setIsCreatingNote] = React.useState(false);

    const activeNote = React.useMemo(
        () => notes.find((note) => note.id === activeNoteId) ?? null,
        [activeNoteId, notes],
    );

    const saveOverHttp = React.useCallback(
        async (noteId: string, nextTitle: string, nextContent: string) => {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: nextTitle,
                    content: nextContent,
                }),
            });

            if (!response.ok) {
                throw new Error("HTTP save failed");
            }

            const updatedNote: Note = await response.json();
            setNotes((previous) =>
                previous.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
            );
            setSaveStatus("saved");
        },
        [],
    );

    React.useEffect(() => {
        if (!notebookId) {
            setError("Notebook id is missing.");
            setIsLoading(false);
            return;
        }

        const fetchNotebookPageData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const notesResponse = await fetch("/api/notes");

                if (!notesResponse.ok) {
                    throw new Error("Failed to load notes.");
                }

                const notesData = await notesResponse.json();

                const notebookNotes = Array.isArray(notesData)
                    ? notesData.filter((note: Note) => note.notebookId === notebookId)
                    : [];

                setNotes(notebookNotes);
                if (notebookNotes.length > 0) {
                    const firstNote = notebookNotes[0];
                    setActiveNoteId(firstNote.id);
                    setTitle(firstNote.title);
                    setContent(firstNote.content);
                } else {
                    setActiveNoteId(null);
                    setTitle("");
                    setContent("");
                }
            } catch {
                setError("Could not load this notebook right now.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotebookPageData();
    }, [notebookId]);

    React.useEffect(() => {
        if (!activeNote || !editorRef.current) {
            return;
        }

        setTitle(activeNote.title);
        setContent(activeNote.content);
        editorRef.current.innerHTML = activeNote.content;
    }, [activeNote]);

    React.useEffect(() => {
        if (!notebookId) {
            return;
        }

        let isClosed = false;

        const connect = async () => {
            try {
                await fetch("/api/notes/ws");
            } catch {
                // Continue and attempt websocket connection even if bootstrap fails.
            }

            if (isClosed) {
                return;
            }

            const protocol = window.location.protocol === "https:" ? "wss" : "ws";
            const socket = new WebSocket(`${protocol}://${window.location.host}/api/notes/ws`);
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
    }, [notebookId]);

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

            const createdNote: Note = await response.json();
            setNotes((previous) => [createdNote, ...previous]);
            setActiveNoteId(createdNote.id);
            setTitle(createdNote.title);
            setContent(createdNote.content);
            setSaveStatus("idle");
        } catch {
            setError("Could not create a new note.");
        } finally {
            setIsCreatingNote(false);
        }
    };

    const applyEditorCommand = (command: string) => {
        document.execCommand(command, false);
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    };

    const performSave = React.useCallback(
        async (noteId: string, nextTitle: string, nextContent: string) => {
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
                setNotes((previous) =>
                    previous.map((note) =>
                        note.id === noteId
                            ? {
                                ...note,
                                title: nextTitle,
                                content: nextContent,
                            }
                            : note,
                    ),
                );
                return;
            }

            try {
                await saveOverHttp(noteId, nextTitle, nextContent);
            } catch {
                setSaveStatus("error");
            }
        },
        [saveOverHttp],
    );

    React.useEffect(() => {
        if (!activeNoteId) {
            return;
        }

        const timer = window.setTimeout(() => {
            void performSave(activeNoteId, title, content);
        }, 600);

        return () => {
            window.clearTimeout(timer);
        };
    }, [activeNoteId, content, performSave, title]);

    const editorStatusText =
        saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
              ? "Saved"
              : saveStatus === "error"
                ? "Save failed"
                : "Idle";

    const previewText = (html: string): string => {
        return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    };

    const onEditorInput = () => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    };

    return (
        <div className="space-y-4">
            {isLoading && <p>Loading notes...</p>}
            {!isLoading && error && <p>{error}</p>}
            {!isLoading && !error && (
                <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
                    <aside className="space-y-3 rounded border p-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Notes</h2>
                            <Button onClick={createNote} disabled={isCreatingNote} size="sm">
                                {isCreatingNote ? "Creating..." : "New"}
                            </Button>
                        </div>

                        {notes.length === 0 && (
                            <p className="text-muted-foreground text-sm">No notes yet. Create one to start writing.</p>
                        )}

                        <ul className="space-y-2">
                            {notes.map((note) => (
                                <li key={note.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveNoteId(note.id)}
                                        className={`w-full rounded border p-2 text-left ${activeNoteId === note.id ? "bg-muted border-foreground/20" : "hover:bg-muted/60"
                                            }`}
                                    >
                                        <p className="truncate text-sm font-medium">{note.title}</p>
                                        <p className="text-muted-foreground truncate text-xs">
                                            {previewText(note.content) || "Empty"}
                                        </p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className="space-y-3 rounded border p-4">
                        {!activeNote && (
                            <p className="text-muted-foreground text-sm">Select a note or create a new one.</p>
                        )}

                        {activeNote && (
                            <>
                                <div className="flex items-center justify-between gap-3">
                                    <Input
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder="Note title"
                                        className="max-w-xl"
                                    />
                                    <p className="text-muted-foreground text-xs">{editorStatusText}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => applyEditorCommand("bold")}>
                                        Bold
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => applyEditorCommand("italic")}>
                                        Italic
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => applyEditorCommand("underline")}>
                                        Underline
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => applyEditorCommand("insertUnorderedList")}>
                                        Bullets
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => applyEditorCommand("insertOrderedList")}>
                                        Numbered
                                    </Button>
                                </div>

                                <div
                                    ref={editorRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={onEditorInput}
                                    className="min-h-[420px] rounded border p-4 leading-7 focus:outline-none"
                                />
                            </>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
