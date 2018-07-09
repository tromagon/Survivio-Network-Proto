import { ClientSocket, OnConnected, OnDisconnected, OnMessage } from "./ClientSocket";

export class ClientWebSocket implements ClientSocket {
    public onConnected:OnConnected;
    public onDisconnected:OnDisconnected;
    public onMessage:OnMessage;

    private socket:WebSocket;

    constructor(url:string) {
        this.socket = new WebSocket(url);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = () => {
            this.onConnected();
        };

        this.socket.onclose = () => {
            this.onDisconnected();
        };

        this.socket.onmessage = (message:any) => {
            this.onMessage(message.data);
        };
    }

    public send(message:any):void {
        this.socket.send(message);
    }
}