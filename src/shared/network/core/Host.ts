import { Network } from './Network';
import { NetIncomingPacket } from './NetIncomingPacket';

export class Host {
    private _tickRate:number;
    protected get tickRate():number {
        return this._tickRate;
    }

    private _tickCount:number = 0;
    protected get tickCount():number {
        return this._tickCount;
    }

    private _network:Network = new Network();
    protected get network():Network {
        return this._network;
    }

    protected lastTS: number;
    private updateInterval:NodeJS.Timer;

    protected setUpdateRate(tickRate:number) {
        this._tickRate = tickRate;

        clearInterval(this.updateInterval);
        this.updateInterval = global.setInterval(
            (delta:number) => this.internalUpdate(delta),
            1000 / this._tickRate
        );
    }

    private internalUpdate(delta:number) {
        ++this._tickCount;
        this.update(delta);
    }
    
    protected update(delta:number) {
    }

    protected pollpackets(timestamp: number): NetIncomingPacket[] {
        let incomingPackets = [];
        while (true) {
            let incomingPacket = this.network.receive(timestamp);
            if (!incomingPacket) {
                break;
            }

            incomingPackets.push(incomingPacket);
        }

        return incomingPackets;
    }
}