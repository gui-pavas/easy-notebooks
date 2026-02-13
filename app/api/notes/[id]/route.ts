import { NextRequest, NextResponse } from "next/server";
import { noteController } from "@/lib/controllers/noteController";
import { resolveUserIdFromSession } from "@/lib/utils/auth";

type NoteParams = {
    id: string;
};

export async function GET(
    _: NextRequest,
    context: { params: Promise<NoteParams> },
): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    const { id } = await context.params;
    return noteController.show(user.userId, id);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<NoteParams> },
): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    const { id } = await context.params;
    return noteController.update(user.userId, id, request);
}

export async function DELETE(
    _: NextRequest,
    context: { params: Promise<NoteParams> },
): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    const { id } = await context.params;
    return noteController.destroy(user.userId, id);
}
