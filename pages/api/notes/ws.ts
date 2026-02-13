import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HttpServer, IncomingMessage } from "http";
import type { Socket } from "net";
import { getToken } from "next-auth/jwt";
import { RawData, WebSocket, WebSocketServer } from "ws";
import { env } from "@/lib/config/env";
import { notesService } from "@/lib/services/noteService";

type WebSocketServerWithNotes = HttpServer & {
  notesWebSocketServer?: WebSocketServer;
};

type MessagePayload = {
  type: "autosave";
  noteId: string;
  title: string;
  content: string;
};

type UserWebSocket = WebSocket & {
  userId?: string;
};

function rejectUpgrade(socket: Socket, status = 401, message = "Unauthorized") {
  socket.write(`HTTP/1.1 ${status} ${message}\r\n\r\n`);
  socket.destroy();
}

function parsePayload(data: unknown): MessagePayload | null {
  if (typeof data !== "string") {
    return null;
  }

  const parsed = JSON.parse(data) as Partial<MessagePayload>;
  if (parsed.type !== "autosave") {
    return null;
  }

  if (
    typeof parsed.noteId !== "string" ||
    typeof parsed.title !== "string" ||
    typeof parsed.content !== "string"
  ) {
    return null;
  }

  if (parsed.noteId.trim().length === 0 || parsed.title.trim().length === 0) {
    return null;
  }

  return {
    type: "autosave",
    noteId: parsed.noteId.trim(),
    title: parsed.title.trim(),
    content: parsed.content,
  };
}

function initializeNotesWebSocketServer(server: WebSocketServerWithNotes): WebSocketServer {
  const wsServer = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (request: IncomingMessage, socket: Socket, head: Buffer) => {
    const host = request.headers.host ?? "localhost:3000";
    const requestUrl = new URL(request.url ?? "", `http://${host}`);
    if (requestUrl.pathname !== "/api/notes/ws") {
      return;
    }

    const token = await getToken({
      req: request as NextApiRequest,
      secret: env.NEXTAUTH_SECRET,
    });

    const userId = token?.sub;
    if (!userId) {
      rejectUpgrade(socket);
      return;
    }

    wsServer.handleUpgrade(request, socket, head, (websocket: WebSocket) => {
      const userSocket = websocket as UserWebSocket;
      userSocket.userId = userId;
      wsServer.emit("connection", userSocket, request);
    });
  });

  wsServer.on("connection", (socket: UserWebSocket) => {
    socket.on("message", async (raw: RawData) => {
      try {
        const payload = parsePayload(raw.toString());
        if (!payload || !socket.userId) {
          socket.send(JSON.stringify({ type: "error", message: "Invalid autosave payload." }));
          return;
        }

        const note = await notesService.update(
          socket.userId,
          payload.noteId,
          payload.title,
          payload.content,
        );

        if (!note) {
          socket.send(JSON.stringify({ type: "error", message: "Note not found." }));
          return;
        }

        socket.send(
          JSON.stringify({
            type: "saved",
            noteId: note.id,
            updatedAt: note.updatedAt.toISOString(),
          }),
        );
      } catch {
        socket.send(JSON.stringify({ type: "error", message: "Could not save note." }));
      }
    });
  });

  server.notesWebSocketServer = wsServer;
  return wsServer;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const server = (res.socket as Socket & { server?: WebSocketServerWithNotes })?.server;
  if (!server) {
    res.status(500).json({ error: "Server is not available." });
    return;
  }

  if (!server.notesWebSocketServer) {
    initializeNotesWebSocketServer(server);
  }

  res.status(200).json({ ok: true });
}
