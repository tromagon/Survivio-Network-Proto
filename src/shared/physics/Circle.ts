import { Shape, ShapeType } from "./Shape";

export class Circle extends Shape {
    
    private _radius:number;
    public get radius():number {
        return this._radius;
    }

    constructor(radius:number) {
        super(ShapeType.Circle, radius * 2, radius * 2);
        this._radius = radius;
    }
}