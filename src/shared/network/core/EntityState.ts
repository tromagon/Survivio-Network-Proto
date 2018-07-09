export class EntityState {
    public entityId:number;
    public type:number;
    public bitmask:number = 0;
    public propertyTypes:number[] = [];
    public propertyValues:any[] = [];
    public maxBitOffset:number = 0;
}

