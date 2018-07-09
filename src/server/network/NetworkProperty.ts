import { BaseBitProperty, BitPropertyType } from "shared/network/core/BitProperty";

export abstract class BaseNetworkProperty {
    protected _isDirty:boolean = false;
    public get isDirty():boolean {
        return this._isDirty;
    }

    public cleanDirty():void {
        this._isDirty = false;
    }

    public abstract get value():any; 
    public abstract get type():BitPropertyType;
    public abstract get bitOffset():number;
}

export class NetworkProperty<T extends BaseBitProperty> extends BaseNetworkProperty {
    private _bitProperty:T;
    
    public get value():any {
        return this._bitProperty.value;
    }

    public set value(newValue:any) {
        this._bitProperty.value = newValue;
        this._isDirty = true;
    }

    public get type():BitPropertyType {
        return this._bitProperty.type;
    }

    public get bitOffset():number {
        return this._bitProperty.bitOffset;
    }

    constructor(bitProperty:T) {
        super();
        this._bitProperty = bitProperty;
    }
}