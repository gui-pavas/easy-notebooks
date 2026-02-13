import { NextRequest, NextResponse } from "next/server";
import { noteController } from "@/lib/controllers/noteController";

export async function GET(): Promise<NextResponse> {
    return noteController.index();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    return noteController.create(request);
}
