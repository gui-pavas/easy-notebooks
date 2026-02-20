// realtime/setup.ts
import type { IncomingMessage, Server as HttpServer } from "http";
import type { Socket } from "net";
import type { NextApiRequest } from "next";
import { WebSocketServer, WebSocket } from "ws";
import { getToken } from "next-auth/jwt";
import { env } from "@/lib/config/env";
import { handleAutosaveMessage } from "./handlers";
import { UserWebSocket } from "./types";

const AUTOSAVE_SOCKET_PATH = "/api/notes/autosave-socket";

function rejectUpgrade(socket: Socket, status = 401, message = "Unauthorized") {
    socket.write(`HTTP/1.1 ${status} ${message}\r\n\r\n`);
    socket.destroy();
}

export function setupWebSockets(server: HttpServer) {
    const wsServer = new WebSocketServer({ noServer: true });

    server.on("upgrade", async (request: IncomingMessage, socket: Socket, head: Buffer) => {
        try {
            const host = request.headers.host ?? "localhost:3000";
            const requestUrl = new URL(request.url ?? "", `http://${host}`);

            if (requestUrl.pathname !== AUTOSAVE_SOCKET_PATH) {
                return;
            }

            const token = await getToken({
                req: request as NextApiRequest,
                secret: env.NEXTAUTH_SECRET,
            });

            const userId = token?.sub;
            if (!userId) {
                return rejectUpgrade(socket);
            }

            wsServer.handleUpgrade(request, socket, head, (websocket: WebSocket) => {
                const userSocket = websocket as UserWebSocket;
                userSocket.userId = userId;
                wsServer.emit("connection", userSocket, request);
            });
        } catch (error) {
            console.error("WebSocket upgrade error:", error);
            rejectUpgrade(socket, 500, "Internal Server Error");
        }
    });

    wsServer.on("connection", (socket: UserWebSocket) => {
        socket.on("message", (raw) => handleAutosaveMessage(socket, raw));
    });

    return wsServer;
}
