import { NextResponse } from "next/server";
import { Prisma } from "../generated/prisma/client";

function badRequest(message: string): NextResponse {
    return NextResponse.json({ error: message }, { status: 400 });
}

function internalServerError(): NextResponse {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isNotFoundError(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
    );
}

function isForeignKeyError(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
    );
}

export { badRequest, internalServerError, isRecord, isNotFoundError, isForeignKeyError };