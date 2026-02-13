import { NextRequest, NextResponse } from "next/server";
import { notebookService } from "../services/notebookService";
import {
    badRequest,
    databaseSetupErrorResponse,
    internalServerError,
    isRecord,
} from "../utils/validation";

export class NotebookController {
    public async index(userId: string): Promise<NextResponse> {
        try {
            const notebooks = await notebookService.index(userId);
            return NextResponse.json(notebooks);
        } catch (error: unknown) {
            const setupError = databaseSetupErrorResponse(error);
            if (setupError) {
                return setupError;
            }

            return internalServerError();
        }
    }

    public async create(userId: string, request: NextRequest): Promise<NextResponse> {
        const body = await request.json().catch(() => null);
        if (!isRecord(body)) {
            return badRequest("Request body must be a JSON object.");
        }

        const { name } = body;
        if (typeof name !== "string" || name.trim().length === 0) {
            return badRequest("Field 'name' is required.");
        }

        try {
            const notebook = await notebookService.create(userId, name.trim());
            return NextResponse.json(notebook, { status: 201 });
        } catch (error: unknown) {
            const setupError = databaseSetupErrorResponse(error);
            if (setupError) {
                return setupError;
            }

            return internalServerError();
        }
    }

    public async show(userId: string, id: string): Promise<NextResponse> {
        const notebook = await notebookService.findById(userId, id);
        if (!notebook) {
            return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
        }

        return NextResponse.json(notebook);
    }

    public async update(userId: string, id: string, request: NextRequest): Promise<NextResponse> {
        const body = await request.json().catch(() => null);
        if (!isRecord(body)) {
            return badRequest("Request body must be a JSON object.");
        }

        const { name } = body;
        if (typeof name !== "string" || name.trim().length === 0) {
            return badRequest("Field 'name' is required.");
        }

        try {
            const notebook = await notebookService.update(userId, id, name.trim());
            if (!notebook) {
                return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
            }

            return NextResponse.json(notebook);
        } catch {
            return internalServerError();
        }
    }

    public async destroy(userId: string, id: string): Promise<NextResponse> {
        try {
            const notebook = await notebookService.delete(userId, id);
            if (!notebook) {
                return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
            }

            return NextResponse.json(notebook);
        } catch {
            return internalServerError();
        }
    }
}

export const notebookController = new NotebookController();
