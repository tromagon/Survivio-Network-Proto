import { Message } from "../core/Message";
import { MessageType } from "./MessageType";
import { EntityState } from "../core/EntityState";

export class UpdateMessage extends Message {
    public seqNum:number;
    public ackInput:number;
    public fullStates:EntityState[] = [];
    public deltaStates:EntityState[] = [];

    constructor() {
        super(MessageType.Update);
    }
}