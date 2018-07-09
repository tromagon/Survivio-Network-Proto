import { Transform } from "../../shared/utils/Transform";
import { Collider } from "../../shared/physics/Collider";

export abstract class GameObject {
    private _id:number;
    public get id():number {
        return this._id;
    }

    private _type:number;
    public get type():number {
        return this._type;
    }

    public collider:Collider;

    protected _transform:Transform;
    public get transform():Transform {
        return this._transform;
    }

    constructor(id:number, type:number) {
        this._id = id;
        this._type = type;
    }
}