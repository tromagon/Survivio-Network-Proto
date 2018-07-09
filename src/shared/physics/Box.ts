import { Shape, ShapeType } from "./Shape";

export class Box extends Shape {
    
    constructor(width:number, height:number) {
        super(ShapeType.Box, width, height);
    }
}