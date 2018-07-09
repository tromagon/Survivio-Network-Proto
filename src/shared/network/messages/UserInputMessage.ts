import { Message } from "../core/Message";
import { MessageType } from "./MessageType";

export class UserInputMessage extends Message {
    public pressTime: number;
    public inputSequenceNumber: number;
    public hMove: number = 0;
    public vMove: number = 0;
    public x: number;
    public mouseDirection:number;

    constructor() {
        super(MessageType.UserInput);
    }
}