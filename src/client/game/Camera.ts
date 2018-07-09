import { Rectangle } from "pixi.js";
import { GameObject } from "./GameObject";

export class Camera {
    public x:number = 0;
    public y:number = 0;

    private _viewport:Rectangle;
    public get viewport():Rectangle {
        return this._viewport;
    }

    private _target:GameObject;
    public get target():GameObject {
        return this._target;
    }

    constructor(viewport:Rectangle) {
        this._viewport = viewport;
    }

    public follow(target:GameObject) {
        this._target = target;
    }

    public update(delta:number) {
        if (this._target == null) return;

        this.x = this._target.transform.x;
        this.y = this._target.transform.y;
    }
}