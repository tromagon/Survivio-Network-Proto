export type OnClientConnected = (id: number) => void;
export type OnClientDisconnected = (id: number) => void;
export type OnClientMessage = (id: number, message: any) => void;
export type OnClientError = (id: number, message: any) => void;

export interface ServerSocket {
    onClientConnected:OnClientConnected;
    onClientDisconnected:OnClientDisconnected;
    onClientMessage:OnClientMessage;
    onClientError:OnClientError;

    sendTo(id:number, message:any):void;
}