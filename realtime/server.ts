// server.ts
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { setupWebSockets } from "./setup";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling request", req.url, err);
            res.statusCode = 500;
            res.end("Internal Server Error");
        }
    });

    setupWebSockets(server);

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
        console.log(`> WebSockets enabled on ws://${hostname}:${port}/api/notes/autosave-socket`);
    });
});