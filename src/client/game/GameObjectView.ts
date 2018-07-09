import { Container } from "pixi.js";
import { Transform } from "../../shared/utils/Transform";
import { GameObject } from './GameObject';
import { LocalTransform } from "../utils/LocalTransform";

export class GameObjectView {
    private _gameObject:GameObject;
    public get gameObject():GameObject {
        return this._gameObject;
    }

    private _container:Container;
    public get container():Container {
        return this._container;
    }

    private _transform:Transform;
    public get transform():Transform {
        return this._transform;
    }

    constructor(container:Container, worldObject?:GameObject) {
        this._transform = worldObject ? worldObject.transform : new LocalTransform();
        this._gameObject = worldObject;
        this._container = container;
    }
}