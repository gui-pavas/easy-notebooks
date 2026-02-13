import { NextRequest, NextResponse } from "next/server";
import { notebookController } from "@/lib/controllers/notebookController";
import { resolveUserIdFromSession } from "@/lib/utils/auth";

export async function GET(): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    return notebookController.index(user.userId);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    return notebookController.create(user.userId, request);
}
