import { NetworkEntity } from "../network/NetworkEntity";

export class FixedEntity extends NetworkEntity {
    constructor(type:number) {
        super(type);
        this.isFixed = true;
    }
}