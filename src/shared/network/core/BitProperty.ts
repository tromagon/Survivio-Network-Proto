export enum BitPropertyType {
    uint8,
    uint16,
    uint32,
    int8,
    int16,
    int32,
    float32,
    float64,
    string,
    bool
}

export abstract class BaseBitProperty {
    protected _value:any;
    public get value():any {
        return this._value;
    }

    public set value(newValue:any) {
        this._value = newValue;
    }

    public abstract get type():any;

    private _bitOffset:number;
    public get bitOffset():number {
        return this._bitOffset;
    }

    constructor(bitOffset:number, defaultValue?:any) {
        this._bitOffset = bitOffset;
        this._value = defaultValue;
    }

    public abstract copy():BaseBitProperty;
}

export abstract class BitProperty<T> extends BaseBitProperty {
    public get value():T {
        return this._value;
    }

    public set value(newValue:T) {
        this._value = newValue;
    }
}

export class BitUint8 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.uint8;
    }

    public copy():BitUint8 {
        return new BitUint8(this.bitOffset, this.value);
    }
}

export class BitUint16 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.uint16;
    }

    public copy():BitUint16 {
        return new BitUint16(this.bitOffset, this.value);
    }
}

export class BitUint32 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.uint32;
    }

    public copy():BitUint32 {
        return new BitUint32(this.bitOffset, this.value);
    }
}

export class BitInt8 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.int8;
    }

    public copy():BitInt8 {
        return new BitInt8(this.bitOffset, this.value);
    }
}

export class BitInt16 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.int16;
    }

    public copy():BitInt16 {
        return new BitInt16(this.bitOffset, this.value);
    }
}

export class BitInt32 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.int32;
    }

    public copy():BitInt32 {
        return new BitInt32(this.bitOffset, this.value);
    }
}

export class BitFloat32 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.float32;
    }

    public copy():BitFloat32 {
        return new BitFloat32(this.bitOffset, this.value);
    }
}

export class BitFloat64 extends BitProperty<number> {
    public get type():number {
        return BitPropertyType.float64;
    }

    public copy():BitFloat64 {
        return new BitFloat64(this.bitOffset, this.value);
    }
}

export class BitString extends BitProperty<string> {
    public get type():number {
        return BitPropertyType.string;
    }

    public copy():BitString {
        return new BitString(this.bitOffset, this.value);
    }
}

export class BitBoolean extends BitProperty<boolean> {
    public get type():number {
        return BitPropertyType.bool;
    }

    public copy():BitBoolean {
        return new BitBoolean(this.bitOffset, this.value);
    }
}