import { NextRequest, NextResponse } from "next/server";
import { notebookService } from "../services/notebookService";
import { badRequest, internalServerError, isNotFoundError, isRecord } from "../utils/validation";

export class NotebookController {
    public async index(): Promise<NextResponse> {
        const notebooks = await notebookService.index();
        return NextResponse.json(notebooks);
    }

    public async create(request: NextRequest): Promise<NextResponse> {
        const body = await request.json().catch(() => null);
        if (!isRecord(body)) {
            return badRequest("Request body must be a JSON object.");
        }

        const { name } = body;
        if (typeof name !== "string" || name.trim().length === 0) {
            return badRequest("Field 'name' is required.");
        }

        const notebook = await notebookService.create(crypto.randomUUID(), name.trim());
        return NextResponse.json(notebook, { status: 201 });
    }

    public async show(id: string): Promise<NextResponse> {
        const notebook = await notebookService.findById(id);
        if (!notebook) {
            return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
        }

        return NextResponse.json(notebook);
    }

    public async update(id: string, request: NextRequest): Promise<NextResponse> {
        const body = await request.json().catch(() => null);
        if (!isRecord(body)) {
            return badRequest("Request body must be a JSON object.");
        }

        const { name } = body;
        if (typeof name !== "string" || name.trim().length === 0) {
            return badRequest("Field 'name' is required.");
        }

        try {
            const notebook = await notebookService.update(id, name.trim());
            return NextResponse.json(notebook);
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
            }

            return internalServerError();
        }
    }

    public async destroy(id: string): Promise<NextResponse> {
        try {
            const notebook = await notebookService.delete(id);
            return NextResponse.json(notebook);
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
            }

            return internalServerError();
        }
    }
}

export const notebookController = new NotebookController();
