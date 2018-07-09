import { UserInputMessage } from "../messages/UserInputMessage";
import { Stream } from "./Stream";
import { BitStream } from "bit-buffer";

export class UserInputStream implements Stream<UserInputMessage> {

    public read(src:BitStream, dest:UserInputMessage):UserInputMessage {
        dest.pressTime = src.readFloat32();
        dest.inputSequenceNumber = src.readUint32();
        dest.hMove = src.readInt8();
        dest.vMove = src.readInt8();
        dest.mouseDirection = src.readFloat32();
        return dest;
    }

    public write(src:UserInputMessage, dest:BitStream):any {
        dest.writeFloat32(src.pressTime);
        dest.writeUint32(src.inputSequenceNumber);
        dest.writeInt8(src.hMove);
        dest.writeInt8(src.vMove);
        dest.writeFloat32(src.mouseDirection);
        return dest;
    }
}