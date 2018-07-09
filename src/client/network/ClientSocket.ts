export type OnConnected = () => void;
export type OnDisconnected = () => void;
export type OnMessage = (message: any) => void;

export interface ClientSocket {
    onConnected:OnConnected;
    onDisconnected:OnDisconnected;
    onMessage:OnMessage;

    send(message:any):void;
}