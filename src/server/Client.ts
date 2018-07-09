import { PlayerEntity } from "entities/PlayerEntity";

export enum ClientState {
    WaitingToJoin,
    Joined,
    Spectating
}

export class Client {

    private _id:number;
    public get id():number {
        return this._id;
    }

    public ack:number;
    public playerEntity:PlayerEntity;
    public state:ClientState;
    public ackInput:number = 0;
    public interest:number[] = [];

    constructor(id:number) {
        this._id = id;
    }
}