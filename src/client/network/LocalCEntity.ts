import { CharacterCEntity } from "./CharacterCEntity";
import { UserInputMessage } from '../../shared/network/messages/UserInputMessage';
import { EntityState } from '../../shared/network/core/EntityState';
import { LocalTransform } from '../utils/LocalTransform';

class LocalEntityState {
    public inputSequenceNumber:number;
    public transform:LocalTransform = new LocalTransform();;
}

export class LocalCEntity extends CharacterCEntity {
    public ackInput:number = 0;

    private previousStates: Array<LocalEntityState> = [];
    private inputSequenceNumber: number = 0;
    private pendingInputs: Array<UserInputMessage> = [];

    public incrementSequenceNumber(): number {
        ++this.inputSequenceNumber;
        return this.inputSequenceNumber;
    }

    public saveInput(input: UserInputMessage) {
        this.pendingInputs.push(input);
    }

    public applyInput(userInput:UserInputMessage):void {
        let localState = new LocalEntityState();
        localState.inputSequenceNumber = userInput.inputSequenceNumber;
        localState.transform.x = this.transform.x;
        localState.transform.y = this.transform.y;
        localState.transform.rotation = this.transform.rotation;

        this.previousStates.push(localState);

        let moveAngle = Math.atan2((userInput.vMove), (userInput.hMove));
        if (userInput.hMove != 0 || userInput.vMove != 0) {
            this.collider.moveTo(
                this.transform.x + Math.cos(moveAngle) * this.speed.value * userInput.pressTime, 
                this.transform.y + Math.sin(moveAngle) * this.speed.value * userInput.pressTime
            );
        }

        this.transform.rotation = userInput.mouseDirection;
    }

    public applyState(entityState:EntityState) {
        let j = 0;
        while (j < this.previousStates.length)
        {
            let previousEntityState = this.previousStates[j];
            
            // first drop all outdated inputs
            if (previousEntityState.inputSequenceNumber < this.ackInput - 1) {
                this.previousStates.splice(j, 1);
                continue;
            }
            
            this.transform.x = previousEntityState.transform.x;
            this.transform.y = previousEntityState.transform.y;
            this.transform.rotation = previousEntityState.transform.rotation;
            break;
        }

        super.applyState(entityState);

        if (S_RECONC) {
            this.reconcile();
        }
    }

    public reconcile() {
        
        // // apply position from the server
        // this.x = entityState.x;

        // error correction here by looking up for the input that matches the new state sent back from the server
        // what needs to be introduced here is a LocalEntityState that contains the x position instead of having it inside 
        // the user input. User input should be purely reserved for actual user inputs and not the result of it

        for (let i = 0, l = this.pendingInputs.length; i < l; ++i) {
            let input = this.pendingInputs[i];

            if (input.inputSequenceNumber == this.ackInput) {
                let offset = this.transform.x - input.x;
                if (Math.abs(offset) >= 0.00001) {
                    
                    console.log("DOES NOT MATCH");
                    //this.error = true;
                    //this.errorTimer = 0.0;
                }
            }
        }

        // TODO should all this be in one single loop?
        // then run through all other pending inputs and re-apply them
        let j = 0;
        while (j < this.pendingInputs.length)
        {
            let input = this.pendingInputs[j];

            // first drop all outdated inputs
            if (input.inputSequenceNumber <= this.ackInput) {
                this.pendingInputs.splice(j, 1);
            }
            else {
                this.applyInput(input);
                ++j;
            }
        }
    }
}