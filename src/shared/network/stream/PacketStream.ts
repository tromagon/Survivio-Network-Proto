import { Packet } from "../core/Packet";
import { Message } from '../core/Message';
import { Stream } from './Stream';
import { MessageType } from '../messages/MessageType';
import { JoinStream } from "./JoinStream";
import { UserInputStream } from './UserInputStream';
import { UpdateStream } from './UpdateStream';
import { JoinMessage } from "../messages/JoinMessage";
import { UserInputMessage } from '../messages/UserInputMessage';
import { BitStream } from "bit-buffer";
import { UpdateMessage } from "../messages/UpdateMessage";

type MessageMap = { [key:number]: new() => Message };
type MessageStreamMap = { [key:number]: Stream<Message> };

export class PacketStream implements Stream<Packet> {

    private messageMap:MessageMap = {};
    private streamMap:MessageStreamMap = [];

    constructor() {
        this.messageMap[MessageType.Join] = JoinMessage;
        this.messageMap[MessageType.UserInput] = UserInputMessage;
        this.messageMap[MessageType.Update] = UpdateMessage;
        
        this.streamMap[MessageType.Join] = new JoinStream();
        this.streamMap[MessageType.UserInput] = new UserInputStream();
        this.streamMap[MessageType.Update] = new UpdateStream();
    }

    public read(src:BitStream, dest:Packet):Packet {
        dest.seqNum = src.readUint32();
        dest.ack = src.readUint32();

        let numMessages = src.readUint8();
        for (let i = 0; i < numMessages; ++i) {
            const type = src.readUint8();
            const msg = this.streamMap[type].read(src, new this.messageMap[type]());
            dest.messages.push(msg);
        }

        return dest;
    }

    public write(src:Packet, dest:BitStream):BitStream {
        dest.writeUint32(src.seqNum);
        dest.writeUint32(src.ack);

        let numMessages = src.messages.length;
        dest.writeUint8(numMessages);

        for (let i = 0; i < numMessages; ++i) {
            let message = src.messages[i];
            dest.writeUint8(message.type);

            this.streamMap[message.type].write(message, dest);
        }

        return dest;
    }
}