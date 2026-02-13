import { NextRequest, NextResponse } from "next/server";
import { notesService } from "../services/noteService";
import { badRequest, internalServerError, isForeignKeyError, isNotFoundError, isRecord } from "../utils/validation";

export class NoteController {
    public async index(): Promise<NextResponse> {
        const notes = await notesService.index();
        return NextResponse.json(notes);
    }

    public async create(request: NextRequest): Promise<NextResponse> {
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
                notebookId.trim(),
                title.trim(),
                content,
            );
            return NextResponse.json(note, { status: 201 });
        } catch (error: unknown) {
            if (isForeignKeyError(error)) {
                return NextResponse.json(
                    { error: "Notebook does not exist" },
                    { status: 400 },
                );
            }

            return internalServerError();
        }
    }

    public async show(id: string): Promise<NextResponse> {
        const note = await notesService.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json(note);
    }

    public async update(id: string, request: NextRequest): Promise<NextResponse> {
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
            const note = await notesService.update(id, title.trim(), content);
            return NextResponse.json(note);
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return NextResponse.json({ error: "Note not found" }, { status: 404 });
            }

            return internalServerError();
        }
    }

    public async destroy(id: string): Promise<NextResponse> {
        try {
            const note = await notesService.delete(id);
            return NextResponse.json(note);
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return NextResponse.json({ error: "Note not found" }, { status: 404 });
            }

            return internalServerError();
        }
    }
}

export const noteController = new NoteController();
