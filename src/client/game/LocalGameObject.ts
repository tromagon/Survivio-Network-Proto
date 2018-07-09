import { GameObject } from "./GameObject";
import { LocalTransform } from "../utils/LocalTransform";

export class LocalGameObject extends GameObject {
    constructor(id:number, type:number) {
        super(id, type);
        this._transform =  new LocalTransform();
    }
}