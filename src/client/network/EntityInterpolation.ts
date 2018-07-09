import { Transform } from '../../shared/utils/Transform';
import { LocalTransform } from '../utils/LocalTransform';

export class EntityInterpolation {
    public timestamp: number;
    public transform:Transform = new LocalTransform();

    constructor(timestamp: number) {
        this.timestamp = timestamp;
    }
}