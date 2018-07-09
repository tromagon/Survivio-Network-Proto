import { GameObjectView } from "./GameObjectView";
import { Container, Graphics } from "pixi.js";
import { CharacterCEntity } from '../network/CharacterCEntity';

export class CharacterView extends GameObjectView {
    private radius:number;
    private body: Graphics;
    private hands: Container;

    private static readonly handRadiusOffset:number = 3;

    constructor(characterEntity:CharacterCEntity, bodyRadius:number) {
        super(new Container(), characterEntity);
        this.draw(bodyRadius);
    }

    private draw(bodyRadius:number) {
        this.radius = bodyRadius;

        this.body = new Graphics();
        this.body.beginFill(0xf8c574);
        this.body.drawCircle(0, 0, bodyRadius);
        this.body.endFill();
        this.container.addChild(this.body);

        this.hands = new Container();
        this.container.addChild(this.hands);

        let handRadius = bodyRadius + CharacterView.handRadiusOffset;

        let leftHand = this.createHand();
        this.hands.addChild(leftHand);
        leftHand.x = handRadius * Math.sin(Math.PI / 4);
        leftHand.y = handRadius * Math.cos(Math.PI - Math.PI / 4);

        let rightHand = this.createHand();
        this.hands.addChild(rightHand);
        rightHand.x = handRadius * Math.sin(Math.PI / 4);
        rightHand.y = handRadius * Math.cos(Math.PI / 4);
    }

    private createHand():Graphics {
        let hand = new Graphics()
        hand.beginFill(0x322717);
        hand.drawCircle(0, 0, 27 / 2);
        hand.endFill();
        hand.beginFill(0xf8c574);
        hand.drawCircle(0, 0, 19 / 2);
        hand.endFill();
        return hand;
    }
}