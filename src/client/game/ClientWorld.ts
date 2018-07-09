import { Physics } from "../../shared/physics/Physics";
import { Renderer } from "./Renderer"
import { Camera } from './Camera';
import { GameApplication } from '../context/GameApplication';
import { GameObjectView } from './GameObjectView';
import { BarrelView } from './BarrelView';
import { MapChunkView } from "./MapChunkView";
import { CharacterView } from "./CharacterView";
import { GameObject } from "./GameObject";
import { ShapeType } from '../../shared/physics/Shape';
import { CharacterCEntity } from '../network/CharacterCEntity';
import { BarrelCEntity } from '../network/BarrelCEntity';
import { EntityType } from '../../shared/network/EntityType';
import { EntityState } from '../../shared/network/core/EntityState';

export type GameObjects = { [Key: number]: GameObject };

export class ClientWorld {
    private _physics:Physics;
    private _renderer:Renderer;
    private _camera:Camera;
    private gameObjects:GameObjects = [];

    constructor(gameApplication:GameApplication) {
        this._physics = new Physics();
        this._camera = new Camera(gameApplication.screen);
        this._renderer = new Renderer(gameApplication.stage, this._camera);
    }

    public setCameraTarget(id:number) {
        let target = this.gameObjects[id];
        if (target) {
            this._camera.follow(target);
        }
    }

    public createMap(numCols:number, numRows:number, chunkWidth:number, chunkHeight:number):void {
        let numCells = numCols * numRows;

        for (let i = 0; i < numCells; ++i) {
            let mapChunk = new MapChunkView(chunkWidth, chunkHeight);
            mapChunk.transform.x = (i % numCols) * chunkWidth;
            mapChunk.transform.y = Math.floor(i / numCols) * chunkHeight;

            this._renderer.add(mapChunk);
        }
    }

    public createCharacter(characterEntity:CharacterCEntity) {
        let characterView:CharacterView = new CharacterView(characterEntity, 75 / 2);
        characterView.gameObject.collider = this._physics.createCollider({
            shape: ShapeType.Circle,
            radius: 75 / 2
        }, characterView.transform);

        this.gameObjects[characterEntity.id] = characterView.gameObject;
        this._renderer.add(characterView);
    }

    public createObject(entityState:EntityState) {
        let gameObjectView:GameObjectView;

        switch(entityState.type) {
            case EntityType.Barrel: {
                let barrelEntity = new BarrelCEntity(entityState.entityId);
                barrelEntity.applyState(entityState);

                let barrelView:BarrelView = new BarrelView(
                    barrelEntity, barrelEntity.radius.value
                );

                barrelView.gameObject.collider = this._physics.createCollider({
                    x: barrelEntity.transform.x,
                    y: barrelEntity.transform.y,
                    shape: ShapeType.Circle,
                    radius: barrelEntity.radius.value
                }, barrelView.transform);

                gameObjectView = barrelView;
            }
        }

        this.gameObjects[gameObjectView.gameObject.id] = gameObjectView.gameObject;
        this._renderer.add(gameObjectView);
    }

    public update(delta:number) {
        this._physics.update(delta);
        this._camera.update(delta);
        this._renderer.update(delta);
    }
}