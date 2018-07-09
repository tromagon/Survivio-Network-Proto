import { CharacterEntity } from "./CharacterEntity";
import { UserInputMessage } from "shared/network/messages/UserInputMessage";

export class PlayerEntity extends CharacterEntity {
    public applyInput(userInput:UserInputMessage):void {
        let moveAngle = Math.atan2((userInput.vMove), (userInput.hMove));
        if (userInput.hMove != 0 || userInput.vMove != 0) {
            this.collider.moveTo(
                this.transform.x + Math.cos(moveAngle) * this.speed.value * userInput.pressTime, 
                this.transform.y + Math.sin(moveAngle) * this.speed.value * userInput.pressTime
            );
        }

        this.transform.rotation = userInput.mouseDirection;
    }
}