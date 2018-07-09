import { JoinMessage } from "../messages/JoinMessage";
import { Stream } from "./Stream";
import { BitStream } from "bit-buffer";

export class JoinStream implements Stream<JoinMessage> {

    public read(src:BitStream, dest:JoinMessage):JoinMessage {
        dest.playerEntityId = src.readInt8();
        dest.tickRate = src.readInt8();
        return dest;
    }

    public write(src:JoinMessage, dest:BitStream):any {
        dest.writeInt8(src.playerEntityId);
        dest.writeInt8(src.tickRate);
        return dest;
    }
}