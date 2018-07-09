import { Message } from "../core/Message";
import { MessageType } from "./MessageType";

export class JoinMessage extends Message {
    public playerEntityId: number;
    public tickRate: number;

    constructor() {
        super(MessageType.Join);
    }
}