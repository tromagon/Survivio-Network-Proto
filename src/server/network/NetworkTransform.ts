import { BitFloat32 } from "shared/network/core/BitProperty";
import { Transform } from "shared/utils/Transform";
import { NetworkProperty } from "./NetworkProperty";

export class NetworkTransform implements Transform {
    public xProperty:NetworkProperty<BitFloat32>;
    public yProperty:NetworkProperty<BitFloat32>;
    public rotationProperty:NetworkProperty<BitFloat32>;

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