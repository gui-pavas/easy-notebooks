'use client';

import { useParams } from "next/navigation";
import * as React from "react";

type Note = {
    id: string;
    notebookId: string;
    title: string;
    content: string;
};

export default function NotebookPage() {
    const params = useParams<{ notebookId: string }>();
    const notebookId = params.notebookId;

    const [notes, setNotes] = React.useState<Note[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

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
            } catch {
                setError("Could not load this notebook right now.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotebookPageData();
    }, [notebookId]);

    return (
        <>
            {isLoading && <p>Loading notes...</p>}
            {!isLoading && error && <p>{error}</p>}
            {!isLoading && !error && notes.length === 0 && <p>No notes yet.</p>}

            {!isLoading && !error && notes.length > 0 && (
                <ul className="space-y-3">
                    {notes.map((note) => (
                        <li key={note.id} className="rounded border p-4">
                            <h2 className="font-medium">{note.title}</h2>
                            <p className="mt-1 text-sm text-gray-700">{note.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
