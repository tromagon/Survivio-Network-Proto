import { GameObjectView } from "./GameObjectView";
import { Container, Graphics } from "pixi.js";
import { GameObject } from "./GameObject";

export class BarrelView extends GameObjectView {

    constructor(gameObject:GameObject, radius:number) {
        super(new Graphics(), gameObject);

        let graphic = this.container as Graphics;
        graphic.beginFill(0x626262);
        graphic.drawCircle(0, 0, radius);
        graphic.endFill();
    }
}