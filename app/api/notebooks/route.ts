import { NextRequest, NextResponse } from "next/server";
import { notebookController } from "@/lib/controllers/notebookController";

export async function GET(): Promise<NextResponse> {
    return notebookController.index();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    return notebookController.create(request);
}
