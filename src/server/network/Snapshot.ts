import { EntityState } from "shared/network/core/EntityState";

export class Snapshot {
    public seqNum:number;
    public entityStates:Array<EntityState> = [];

    constructor(seqNum:number) {
        this.seqNum = seqNum;
    }
}