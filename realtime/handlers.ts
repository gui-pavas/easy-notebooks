import { RawData } from "ws";
import { notesService } from "@/lib/services/noteService";
import { MessagePayload, UserWebSocket } from "./types";

export function parsePayload(data: unknown): MessagePayload | null {
    if (typeof data !== "string") return null;

    try {
        const parsed = JSON.parse(data) as Partial<MessagePayload>;
        if (parsed.type !== "autosave") return null;

        if (
            typeof parsed.noteId !== "string" ||
            typeof parsed.title !== "string" ||
            typeof parsed.content !== "string"
        ) {
            return null;
        }

        if (parsed.noteId.trim().length === 0 || parsed.title.trim().length === 0) {
            return null;
        }

        return {
            type: "autosave",
            noteId: parsed.noteId.trim(),
            title: parsed.title.trim(),
            content: parsed.content,
        };
    } catch {
        return null;
    }
}

export async function handleAutosaveMessage(socket: UserWebSocket, raw: RawData) {
    try {
        const payload = parsePayload(raw.toString());

        if (!payload || !socket.userId) {
            socket.send(JSON.stringify({ type: "error", message: "Invalid autosave payload." }));
            return;
        }

        const note = await notesService.update(
            socket.userId,
            payload.noteId,
            payload.title,
            payload.content,
        );

        if (!note) {
            socket.send(JSON.stringify({ type: "error", message: "Note not found." }));
            return;
        }

        socket.send(
            JSON.stringify({
                type: "saved",
                noteId: note.id,
                updatedAt: note.updatedAt.toISOString(),
            })
        );
    } catch (error) {
        console.error("Autosave error:", error);
        socket.send(JSON.stringify({ type: "error", message: "Could not save note." }));
    }
}