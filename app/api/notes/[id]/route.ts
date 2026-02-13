import { NextRequest, NextResponse } from "next/server";
import { noteController } from "@/lib/controllers/noteController";

type NoteParams = {
    id: string;
};

export async function GET(
    _: NextRequest,
    context: { params: Promise<NoteParams> },
): Promise<NextResponse> {
    const { id } = await context.params;
    return noteController.show(id);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<NoteParams> },
): Promise<NextResponse> {
    const { id } = await context.params;
    return noteController.update(id, request);
}

export async function DELETE(
    _: NextRequest,
    context: { params: Promise<NoteParams> },
): Promise<NextResponse> {
    const { id } = await context.params;
    return noteController.destroy(id);
}
