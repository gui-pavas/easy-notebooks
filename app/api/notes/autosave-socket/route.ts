import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json(
        {
            error: "Upgrade Required",
            message: "Connect to this endpoint with a WebSocket client.",
        },
        {
            status: 426,
            headers: {
                Upgrade: "websocket",
            },
        },
    );
}
