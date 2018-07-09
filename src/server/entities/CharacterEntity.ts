import { EntityType } from "shared/network/EntityType";
import { NetworkEntity } from "../network/NetworkEntity";
import { BitString, BitFloat32 } from "shared/network/core/BitProperty";
import { NetworkProperty } from "../network/NetworkProperty";

export class CharacterEntity extends NetworkEntity {
    public color:NetworkProperty<BitString>;
    public speed:NetworkProperty<BitFloat32>;

    constructor() {
        super(EntityType.Character);
        this.color = this.createNetworkProperty(BitString);
        this.speed = this.createNetworkProperty(BitFloat32, 0);
    }
}