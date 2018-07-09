export enum ShapeType {
    Circle,
    Box
}

export class Shape {

    private _type:ShapeType;
    public get type():ShapeType {
        return this._type;
    }

    private _width:number;
    public get width():number {
        return this._width;
    }

    private _height:number;
    public get height():number {
        return this._height;
    }

    constructor(type:ShapeType, width:number, height:number) {
        this._type = type;
        this._width = width;
        this._height = height;
    }
}