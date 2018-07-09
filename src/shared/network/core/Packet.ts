import { Message } from "./Message";

export class Packet {
    public ack:number;
    public seqNum:number;
    public sendTS:number;
    public messages:Array<Message> = [];
}
