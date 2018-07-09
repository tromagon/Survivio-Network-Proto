import { EntityState } from '../../shared/network/core/EntityState';
import { BaseBitProperty, BitFloat32 } from '../../shared/network/core/BitProperty';
import { ClientTransform } from './ClientTransform';
import { GameObject } from '../game/GameObject';

export abstract class ClientEntity extends GameObject {

    private bitProperties:Array<BaseBitProperty> = [];

    constructor(id:number, type:number) {
        super(id, type);

        let clientTransform = new ClientTransform();
        clientTransform.xProperty = this.createBitProperty(BitFloat32, 0);
        clientTransform.yProperty = this.createBitProperty(BitFloat32, 0);
        clientTransform.rotationProperty = this.createBitProperty(BitFloat32, 0);
        this._transform = clientTransform;
    }

    protected createBitProperty<T extends BaseBitProperty>(type: { new(number, any): T ;}, defaultValue?:any):T {
        let bitProp = new type(1 << this.bitProperties.length, defaultValue);
        this.bitProperties.push(bitProp);
        return bitProp;
    }

    public applyState(entityState:EntityState) {
        let valueIndex = 0;
        for (let property of this.bitProperties) {
            if ((property.bitOffset & entityState.bitmask) == 0) continue;

            property.value = entityState.propertyValues[valueIndex];
            ++valueIndex;
        }
    }
}