import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import IDocumentMetadata from "./util/idocument.metadata";
import DocumentDto from "./models/document.dto";

import * as Automerge from "@automerge/automerge";

interface IWebMessage {
    id: string;
    sender?: string;
    timestamp: Date;
    message: string;
    type: string;
};

interface IAutomergeDoc {
    content: string;
}

class WebSocketHandler {
    private _documents_metadata: Map<WebSocket, IDocumentMetadata>
    private _websocket: WebSocketServer;
    private _portNumber: number;

    private _documents: Map<string, Automerge.Doc<IAutomergeDoc>>;
    private _history: Map<string, Uint8Array[]>;

    constructor(port: number) {
        this._portNumber = port;
        this._documents_metadata = new Map();
        this._documents = new Map();
        this._history = new Map();
        this._websocket = new WebSocketServer({ port: this._portNumber });
    }

    public getSocket() {
        return this._websocket;
    }

    public ActivateCommunication = () => {

        this._websocket.on("connection", (websocket: WebSocket) => {
            const client_id: string = uuidv4();
            const connection_time: Date = new Date();
            const metadata: IDocumentMetadata = { client_id, connection_time };

            this._documents_metadata.set(websocket, metadata);

            // message received
            websocket.on("message", async (rawData: string) => {
                const msg: IWebMessage = JSON.parse(JSON.parse(rawData)) as IWebMessage;
                const metadata = this._documents_metadata.get(websocket);

                if (metadata) {
                    msg.sender = metadata?.client_id;
                    msg.timestamp = metadata?.connection_time;

                    if (msg.type === "edit") {
                        this.handleEdit(msg, websocket);
                    } else if (msg.type === "undo") {
                        this.undo(msg.id);
                    } else {
                        this.redo(msg.id);
                    }

                }
            });

            websocket.on("close", () => {
                this._documents_metadata.delete(websocket);
            });
        });
    };


    public handleEdit = async (message: IWebMessage, websocket: WebSocket) => {
        // fetch or initialize document using Automerge
        let document: Automerge.next.Doc<any> | undefined = this._documents.get(message.id);

        if (!document) {
            document = Automerge.init();
        }

        // apply the change to the document using Automerge
        const newDoc = Automerge.change(document, "Edit", (doc: IAutomergeDoc) => {
            doc.content = message.message;
        });

        const binary_change = Automerge.save(newDoc);

        this._documents.set(message.id, newDoc);

        if (!this._history.has(message.id)) {
            this._history.set(message.id, []);
        }
        this._history.get(message.id)?.push(binary_change);

        // update the document with the new content
        const temp_data = { uuid: message.id, content: message.message, updatedAt: message.timestamp };
        await DocumentDto.Update(temp_data);

        const outbound: string = JSON.stringify({ id: message.id, content: newDoc.content });
        // Broadcast the change to all connected clients
        [...this._documents_metadata.keys()].forEach((socket: WebSocket) => {
            if (socket !== websocket) {
                socket.send(outbound);
            }
        });
    };

    public undo = (document_id: string) => {
        const document_changes = this._history.get(document_id);

        if (document_changes && document_changes.length > 0) {
            document_changes.pop(); // remove the last change

            // rebuild the document history
            let _doc: IAutomergeDoc = Automerge.init();
            for (const _change of document_changes) {
                const [newDoc] = Automerge.applyChanges(_doc, [_change]);
                _doc = newDoc;
            }

            this._documents.set(document_id, _doc);

            // Broadcast undo to all the connected clients
            const outBound = JSON.stringify({
                id: document_id, content: _doc.content
            });

            [...this._documents_metadata.keys()].forEach((socket: WebSocket) => {
                socket.send(outBound);
            });
        }

    };

    public redo = (document_id: string) => {
        const document_changes = this._history.get(document_id);

        if (document_changes && document_changes.length > 0) {

            let _change: Uint8Array | undefined = document_changes[document_changes.length - 1];
            let _doc = this._documents.get(document_id) || Automerge.init<IAutomergeDoc>();

            if (_change) {
                const [newDoc] = Automerge.applyChanges(_doc, [_change]);

                this._documents.set(document_id, newDoc);

                // Broadcast undo to all the connected clients
                const outBound = JSON.stringify({
                    id: document_id, content: _doc.content
                });

                [...this._documents_metadata.keys()].forEach((socket: WebSocket) => {
                    socket.send(outBound);
                });
            }
        }
    };
}

export default WebSocketHandler;
