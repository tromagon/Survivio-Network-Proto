import { GameObjectView } from "./GameObjectView";
import { Container, Graphics } from "pixi.js";
import { GameObject } from "./GameObject";

export class ObstacleView extends GameObjectView {

    constructor(gameObject:GameObject, width:number, height:number) {
        super(new Graphics(), gameObject);

        let graphic = this.container as Graphics;
        graphic.beginFill(0x663300);
        graphic.drawRect(0, 0, width, height);
        graphic.endFill();
    }
}