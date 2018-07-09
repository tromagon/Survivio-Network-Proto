import { BaseBitProperty, BitFloat32 } from "shared/network/core/BitProperty";
import { NetworkProperty, BaseNetworkProperty } from "./NetworkProperty";
import { EntityState } from "shared/network/core/EntityState";
import { NetworkTransform } from "./NetworkTransform";
import { Transform } from "shared/utils/Transform";
import { Collider } from "../shared/physics/Collider";

export abstract class NetworkEntity {
    private static curId = -1;

    private _id:number;
    public get id():number {
        return this._id;
    }

    private _type:number;
    public get type():number {
        return this._type;
    }

    public collider:Collider;
    public isFixed:boolean = false;

    private networkProperties:Array<BaseNetworkProperty> = [];

    private _networkTransform:NetworkTransform = new NetworkTransform();
    public get transform():Transform {
        return this._networkTransform;
    }

    constructor(type:number) {
        this._id = ++NetworkEntity.curId;
        this._type = type;

        this._networkTransform.xProperty = this.createNetworkProperty(BitFloat32, 0);
        this._networkTransform.yProperty = this.createNetworkProperty(BitFloat32, 0);
        this._networkTransform.rotationProperty = this.createNetworkProperty(BitFloat32, 0);
    }

    public get isDirty():boolean {
        this.networkProperties.forEach(property => {
            if (property.isDirty) {
                return true;
            }
        });

        return false;
    }

    public cleanDirty():void {
        this.networkProperties.forEach(property => {
            property.cleanDirty();
        });
    }

    protected createNetworkProperty<T extends BaseBitProperty>(type: { new(number, any): T ;}, defaultValue?:any):NetworkProperty<T> {
        let bitProperty = new type(1 << this.networkProperties.length, defaultValue);
        let networkProperty = new NetworkProperty<T>(bitProperty);
        this.networkProperties.push(networkProperty);
        return networkProperty;
    }

    public createFullState():EntityState {
        let state = new EntityState();
        state.entityId = this._id;
        state.type = this._type;
        state.bitmask = 0;
        state.maxBitOffset = this.networkProperties.length;

        for (let property of this.networkProperties) {
            state.bitmask += property.bitOffset;
            state.propertyTypes.push(property.type);
            state.propertyValues.push(property.value);
        }

        return state;
    }
}