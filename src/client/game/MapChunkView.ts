import { GameObjectView } from "./GameObjectView";
import { Graphics } from "pixi.js";

export class MapChunkView extends GameObjectView {
    constructor(width:number, height:number, lineWidth:number = 4) {
        super(new Graphics());

        let graphics = this.container as Graphics;
        graphics.beginFill(0x6d953e);
        graphics.drawRect(0, 0, width, height);
        graphics.beginFill(0x80af49);
        graphics.drawRect(lineWidth / 2, lineWidth / 2, width - lineWidth, height - lineWidth);
        graphics.endFill();
    }
}