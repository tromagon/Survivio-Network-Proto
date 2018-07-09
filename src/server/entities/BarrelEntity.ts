import { FixedEntity } from "./FixedEntity";
import { EntityType } from "shared/network/EntityType";
import { NetworkProperty } from "../network/NetworkProperty";
import { BitUint8 } from "shared/network/core/BitProperty";

export class BarrelEntity extends FixedEntity {
    public radius:NetworkProperty<BitUint8>;

    constructor() {
        super(EntityType.Barrel);
        this.radius = this.createNetworkProperty(BitUint8);
    }
}