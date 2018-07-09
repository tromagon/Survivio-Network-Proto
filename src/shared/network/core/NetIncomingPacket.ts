export class NetIncomingPacket {
    public fromId:number;
    public recvTS:number;
    public packet:any;

    constructor(fromId: number, recvTS: number, packet: any) {
        this.fromId = fromId;
        this.recvTS = recvTS;
        this.packet = packet;
    }
}