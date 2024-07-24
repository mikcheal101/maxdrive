import dotenv from "dotenv";
import Application from "./application";
import WebSocketHandler from "./websocket.handler";
import DbConnection from "./config/database";
import { createServer, Server as HttpServer } from "http";

dotenv.config();

const ws_port: number = Number(process.env.WS_PORT || 8090);
const http_port: number = Number(process.env.PORT || 80);

const http_server: HttpServer = createServer(Application);

// connect to database
const databaseConn = new DbConnection();
databaseConn.createConnection();


// web socket
const websocket_s: WebSocketHandler = new WebSocketHandler(ws_port);

if (websocket_s) {
    websocket_s.ActivateCommunication();
}


http_server.listen(http_port, () => {
    console.log(`Application running on http://localhost:${http_port}`);
});

websocket_s.getSocket().on("listening", () => {
    console.log(`Websocket server running on ws://localhost:${ws_port}`);
});

// ws 
// application.post(`api/documents/:id`); // Establish a WebSocket connection for real-time collaboration on a document.

/**
 * Test cases
 * 1. user can connect to document.
 * 2. user is notified of other users change.
 * 3. user can create document.
 * 4. user can retrieve content of a document using an id
 * 5. wrong id returns an error message.
 * 6. data is stored in database.
 * 7. user presence in real time.
 * 8. show user
 */