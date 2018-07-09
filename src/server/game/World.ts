import { Physics } from "shared/physics/Physics"
import { NetworkEntity } from "../network/NetworkEntity";
import { PlayerEntity } from "../entities/PlayerEntity";
import { BarrelEntity } from "../entities/BarrelEntity";
import { ShapeType } from "shared/physics/Shape";
import { EntityType } from "shared/network/EntityType";

export class World {
    private _physics:Physics;
    public entities:Array<NetworkEntity> = [];

    private _numCols:number;
    public get width():number {
        return this._numCols;
    }

    private _numRows:number;
    public get height():number {
        return this._numRows;
    }

    private _cellSize:number;
    public get cellSize():number {
        return this._cellSize;
    }

    constructor(numCols:number, numRows:number, cellSize:number) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._cellSize = cellSize;
        this._physics = new Physics();
        this.createMap();
    }

    public createPlayer():PlayerEntity {
        let playerEntity = new PlayerEntity();
        playerEntity.speed.value = 0.5;
        playerEntity.color.value = this.getRandomColor();
        this.entities.push(playerEntity);

        playerEntity.collider = this._physics.createCollider({
            shape: ShapeType.Circle,
            radius: 75 / 2
        }, playerEntity.transform);

        return playerEntity;
    }

    private createBarrel(x:number, y:number, radius:number):void {
        let barrelEntity = new BarrelEntity();
        barrelEntity.radius.value = radius;
        barrelEntity.collider = this._physics.createCollider({
            x:x,
            y:y,
            shape: ShapeType.Circle,
            radius: radius
        }, barrelEntity.transform);

        this.entities.push(barrelEntity);
    }

    private createMap():void {
        this.createBarrel(300, 500, 100);
        this.createBarrel(1000, 500, 100);
        this.createBarrel(600, 150, 100);
        this.createBarrel(500, 1300, 200);
    }

    public update(delta:number):void {
        this._physics.update(delta);
    }

    public getRandomColor():string {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }
}