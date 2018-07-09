import { Transform } from "../../shared/utils/Transform";
import { BitFloat32 } from "../../shared/network/core/BitProperty";

export class ClientTransform implements Transform {
    public xProperty:BitFloat32;
    public yProperty:BitFloat32;
    public rotationProperty:BitFloat32;

    public get x():number {
        return this.xProperty.value;
    }

    public set x(value:number) {
        this.xProperty.value = value;
    }

    public get y():number {
        return this.yProperty.value;
    }

    public set y(value:number) {
        this.yProperty.value = value;
    }

    public get rotation():number {
        return this.rotationProperty.value;
    }

    public set rotation(value:number) {
        this.rotationProperty.value = value;
    }
}