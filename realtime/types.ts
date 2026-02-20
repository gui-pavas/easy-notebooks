import { WebSocket } from "ws";

export type MessagePayload = {
    type: "autosave";
    noteId: string;
    title: string;
    content: string;
};

export type UserWebSocket = WebSocket & {
    userId?: string;
};