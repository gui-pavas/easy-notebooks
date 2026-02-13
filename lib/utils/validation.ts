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

function isUniqueConstraintError(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    );
}

function isTableNotFoundError(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2021"
    );
}

function isDatabaseUnavailableError(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientInitializationError &&
        error.errorCode === "P1001"
    );
}

function databaseSetupErrorResponse(error: unknown): NextResponse | null {
    if (isDatabaseUnavailableError(error)) {
        return NextResponse.json(
            { error: "Database is unreachable. Check DATABASE_URL and Postgres service." },
            { status: 500 },
        );
    }

    if (isTableNotFoundError(error)) {
        return NextResponse.json(
            { error: "Database schema is not initialized. Run migrations first." },
            { status: 500 },
        );
    }

    return null;
}


export { badRequest, internalServerError, isRecord, isNotFoundError, isForeignKeyError, isUniqueConstraintError, isTableNotFoundError, isDatabaseUnavailableError, databaseSetupErrorResponse };
