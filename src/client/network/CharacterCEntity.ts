import { ClientEntity } from './ClientEntity';
import { BitFloat32, BitString } from '../../shared/network/core/BitProperty';
import { EntityType } from "../../shared/network/EntityType";

export class CharacterCEntity extends ClientEntity {
    public color:BitString;
    public speed:BitFloat32;

    constructor(id:number) {
        super(id, EntityType.Character);
        this.color = this.createBitProperty(BitString);
        this.speed = this.createBitProperty(BitFloat32, 0);
    }
}