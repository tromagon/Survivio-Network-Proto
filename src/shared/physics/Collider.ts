import { AABB } from "./AABB";
import { ShapeType } from "./Shape";
import { Physics } from "./Physics";
import { Callback } from "../utils/Callback";
import { Transform } from "../utils/Transform";

export interface ColliderDef {
    shape:any;
    x?:number;
    y?:number;
    width?:any;
    height?:any;
    radius?:any;
}

export class Collider {
    private physics:Physics;

    public owner:any;

    private _id:number;
    public get id():number {
        return this._id;
    }

    private _type:ShapeType;
    public get type():ShapeType {
        return this._type;
    }

    private _aabb:AABB;
    public get aabb():AABB {
        return this._aabb;
    }

    private _shape:any;
    public get shape():any {
        return this._shape;
    }

    private _transform:Transform;
    public get transform():Transform {
        return this._transform;
    }

    public isSensor:boolean = false;
    public onEnterCollision:Callback = new Callback();
    public onExitCollision:Callback = new Callback();

    constructor(type:ShapeType, shape:any, physics:Physics, id:number, transform:Transform) {
        this._type = type;
        this._shape = shape;
        this.physics = physics;
        this._aabb = new AABB();
        this._id = id;
        this._transform = transform;

        transform.x = shape.pos.x;
        transform.y = shape.pos.y;
    }

    public moveTo(x:number, y:number):void {
        this._transform.x = x;
        this._transform.y = y;
        this._shape.pos.x = x;
        this._shape.pos.y = y;
        this.physics.onMoved(this);
    }
}