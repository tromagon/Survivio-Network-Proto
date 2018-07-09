import { ClientEntity } from './ClientEntity';
import { BitUint8 } from '../../shared/network/core/BitProperty';
import { EntityType } from "../../shared/network/EntityType";

export class BarrelCEntity extends ClientEntity {
    public radius:BitUint8;

    constructor(id:number) {
        super(id, EntityType.Barrel);
        this.radius = this.createBitProperty(BitUint8);
    }
}