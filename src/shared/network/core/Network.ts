import { NetIncomingPacket } from "./NetIncomingPacket";

type Peers = { [Key: number]: NetPeer };

export class Network {
    private peers:Peers = [];
    private incomingPackets:Array<NetIncomingPacket> = [];

    public onMessage(id:number, packet:any):void {
        this.incomingPackets.push(new NetIncomingPacket(id, +new Date, packet));
    }

    public connectPeer(peerId: number):void {
        this.peers[peerId] = new NetPeer(peerId);
    }

    public disconnectPeer(peerId: number):void {
        this.peers[peerId].connected = false;
    }

    public receive(timestamp: number): NetIncomingPacket | undefined {
        for (let i = 0, l = this.incomingPackets.length; i < l; ++i) {
            let incomingPacket = this.incomingPackets[i];

            if (incomingPacket.recvTS <= timestamp) {
                this.incomingPackets.splice(i, 1);
                return incomingPacket;
            }
        }
    }

    public enqueueSend(peerId:number, message: any):void {
        if (!this.peers[peerId].connected) return;

        this.peers[peerId].sendBuffer.push(message);
    }

    public getSendBuffer(peerId:number):Array<any> {
        if (!this.peers[peerId].connected) {
            delete this.peers[peerId];
            return null;
        }

        // need to pack all messages here

        return this.peers[peerId].sendBuffer;
    }
}

class NetPeer {
    private _id:number;
    public get id():number {
        return this._id;
    }

    public sendBuffer:Array<any> = [];
    public connected:boolean = true;

    constructor(id:number) {
        this._id = id;
    }
}