import { Server } from "http";
import { ServerSocket, OnClientConnected, OnClientDisconnected, OnClientMessage, OnClientError } from "./ServerSocket";
import * as WebSocket from 'ws';

type ClientSockets = { [Key: number]: WebSocket };

export class ServerWebSocket implements ServerSocket {
    public onClientConnected:OnClientConnected;
    public onClientDisconnected:OnClientDisconnected;
    public onClientMessage:OnClientMessage;
    public onClientError:OnClientError;

    private wss:WebSocket.Server;
    private sockets:ClientSockets = {};

    private static curId:number = -1;

    constructor(server:Server) {
        this.wss = new WebSocket.Server({ server: server });

        this.wss.on('connection', (ws: WebSocket) => {
            let id = ++ServerWebSocket.curId;
            this.sockets[id] = ws;
            this.onClientConnected(id);

            ws.on('message', (message) => {
                this.onClientMessage(id, message);
            });

            ws.on('error', (message) => {
                this.onClientError(id, message);
                delete this.sockets[id];
            });

            ws.on("close", () => {
                this.onClientDisconnected(id);
                delete this.sockets[id];
            });
        });
    }

    public sendTo(id:number, message:any):void {
        this.sockets[id].send(message);
    }
}