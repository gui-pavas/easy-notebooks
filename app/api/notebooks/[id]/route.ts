import { NextRequest, NextResponse } from "next/server";
import { notebookController } from "@/lib/controllers/notebookController";

type NotebookParams = {
    id: string;
};

export async function GET(
    _: NextRequest,
    context: { params: Promise<NotebookParams> },
): Promise<NextResponse> {
    const { id } = await context.params;
    return notebookController.show(id);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<NotebookParams> },
): Promise<NextResponse> {
    const { id } = await context.params;
    return notebookController.update(id, request);
}

export async function DELETE(
    _: NextRequest,
    context: { params: Promise<NotebookParams> },
): Promise<NextResponse> {
    const { id } = await context.params;
    return notebookController.destroy(id);
}
