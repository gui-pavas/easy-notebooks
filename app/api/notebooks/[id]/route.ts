import { NextRequest, NextResponse } from "next/server";
import { notebookController } from "@/lib/controllers/notebookController";
import { resolveUserIdFromSession } from "@/lib/utils/auth";

type NotebookParams = {
    id: string;
};

export async function GET(
    _: NextRequest,
    context: { params: Promise<NotebookParams> },
): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    const { id } = await context.params;
    return notebookController.show(user.userId, id);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<NotebookParams> },
): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    const { id } = await context.params;
    return notebookController.update(user.userId, id, request);
}

export async function DELETE(
    _: NextRequest,
    context: { params: Promise<NotebookParams> },
): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    const { id } = await context.params;
    return notebookController.destroy(user.userId, id);
}
