import { NextRequest, NextResponse } from "next/server";
import { noteController } from "@/lib/controllers/noteController";
import { resolveUserIdFromSession } from "@/lib/utils/auth";

export async function GET(): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    return noteController.index(user.userId);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const user = await resolveUserIdFromSession();
    if (user.response) {
        return user.response;
    }

    return noteController.create(user.userId, request);
}
