import { CharacterCEntity } from "./CharacterCEntity";
import { EntityInterpolation } from './EntityInterpolation';
import { EntityState } from '../../shared/network/core/EntityState';
import { LocalTransform } from '../utils/LocalTransform';
import { Time } from '../utils/Time';

export class RemoteCEntity extends CharacterCEntity {
    private interpolationBuffer: Array<EntityInterpolation> = [];
    private transformBuffer = new LocalTransform();
    public entityInterpolation:boolean;

    public applyState(entityState:EntityState):void {
        // for now, we just keep the current position and apply state still
        // this should go away when delta state objects is implemented

        if (E_INTERP) {
            this.transformBuffer.x = this.transform.x;
            this.transformBuffer.y = this.transform.y;
            this.transformBuffer.rotation = this.transform.rotation;

            super.applyState(entityState);

            let interpolation = new EntityInterpolation(Time.currentTime);
            interpolation.transform.x = this.transform.x;
            interpolation.transform.y = this.transform.y;
            interpolation.transform.rotation = this.transform.rotation;
            this.interpolationBuffer.push(interpolation);

            this.transform.x = this.transformBuffer.x;
            this.transform.y = this.transformBuffer.y;
            this.transform.rotation = this.transformBuffer.rotation;
        }
        else {
            super.applyState(entityState);
        }
    }

    public interpolate(renderTimestamp: number):void {
        // Drop older positions so that index 0 and 1 are the two point to interpolate from and to
        while (this.interpolationBuffer.length >= 2 && this.interpolationBuffer[1].timestamp <= renderTimestamp) {
            this.interpolationBuffer.shift();
        }

        // Interpolate between the two surrounding authoritative positions
        if (this.interpolationBuffer.length >= 2 && this.interpolationBuffer[0].timestamp <= renderTimestamp && renderTimestamp <= this.interpolationBuffer[1].timestamp) {
            let i0 = this.interpolationBuffer[0];
            let i1 = this.interpolationBuffer[1];

            //this.transform.x = this.linear(i0.transform.x, i1.transform.x, i0.timestamp, i1.timestamp, renderTimestamp);
            //this.transform.y = this.linear(i0.transform.y, i1.transform.y, i0.timestamp, i1.timestamp, renderTimestamp);

            // Here I don't think a remote player should have a collider attached to it here
            this.collider.moveTo(
                this.linear(i0.transform.x, i1.transform.x, i0.timestamp, i1.timestamp, renderTimestamp),
                this.linear(i0.transform.y, i1.transform.y, i0.timestamp, i1.timestamp, renderTimestamp)
            );

            this.transform.rotation = this.linear(i0.transform.rotation, i1.transform.rotation, i0.timestamp, i1.timestamp, renderTimestamp);
        }
        // Just set this directly if there's only one position
        else if (this.interpolationBuffer.length == 1) {
            // this.transform.x = this.interpolationBuffer[0].transform.x;
            // this.transform.y = this.interpolationBuffer[0].transform.y;

            this.collider.moveTo(this.interpolationBuffer[0].transform.x, this.interpolationBuffer[0].transform.y);
            this.transform.rotation = this.interpolationBuffer[0].transform.rotation;
        }
    }

    private linear(a:number, b:number, t0:number, t1:number, t:number):number {
        return a + (b - a) * (t - t0) / (t1 - t0);
    }
}