import { NextRequest, NextResponse } from "next/server";
import { notesService } from "../services/noteService";
import { badRequest, internalServerError, isRecord } from "../utils/validation";

export class NoteController {
    public async index(userId: string): Promise<NextResponse> {
        const notes = await notesService.index(userId);
        return NextResponse.json(notes);
    }

    public async create(userId: string, request: NextRequest): Promise<NextResponse> {
        const body = await request.json().catch(() => null);
        if (!isRecord(body)) {
            return badRequest("Request body must be a JSON object.");
        }

        const { notebookId, title, content } = body;
        if (typeof notebookId !== "string" || notebookId.trim().length === 0) {
            return badRequest("Field 'notebookId' is required.");
        }

        if (typeof title !== "string" || title.trim().length === 0) {
            return badRequest("Field 'title' is required.");
        }

        if (typeof content !== "string") {
            return badRequest("Field 'content' must be a string.");
        }

        try {
            const note = await notesService.create(
                userId,
                notebookId.trim(),
                title.trim(),
                content,
            );

            if (!note) {
                return NextResponse.json(
                    { error: "Notebook does not exist" },
                    { status: 400 },
                );
            }

            return NextResponse.json(note, { status: 201 });
        } catch {
            return internalServerError();
        }
    }

    public async show(userId: string, id: string): Promise<NextResponse> {
        const note = await notesService.findById(userId, id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json(note);
    }

    public async update(userId: string, id: string, request: NextRequest): Promise<NextResponse> {
        const body = await request.json().catch(() => null);
        if (!isRecord(body)) {
            return badRequest("Request body must be a JSON object.");
        }

        const { title, content } = body;
        if (typeof title !== "string" || title.trim().length === 0) {
            return badRequest("Field 'title' is required.");
        }

        if (typeof content !== "string") {
            return badRequest("Field 'content' must be a string.");
        }

        try {
            const note = await notesService.update(userId, id, title.trim(), content);
            if (!note) {
                return NextResponse.json({ error: "Note not found" }, { status: 404 });
            }

            return NextResponse.json(note);
        } catch {
            return internalServerError();
        }
    }

    public async destroy(userId: string, id: string): Promise<NextResponse> {
        try {
            const note = await notesService.delete(userId, id);
            if (!note) {
                return NextResponse.json({ error: "Note not found" }, { status: 404 });
            }

            return NextResponse.json(note);
        } catch {
            return internalServerError();
        }
    }
}

export const noteController = new NoteController();
