import { ClientEntities } from './ClientHost';
import { CharacterCEntity } from './network/CharacterCEntity';

export class ClientView {
    private canvas:HTMLCanvasElement;
    private paddingFraction:number;
    private yOffset:number;
    private radius:number;
    private ctx:CanvasRenderingContext2D;
    private entities:ClientEntities;

    constructor(entities:ClientEntities) {
        this.entities = entities;
        this.canvas = document.querySelector(`#client canvas`);
        this.paddingFraction = 0.1;
        this.yOffset = this.canvas.height / 2;
        this.radius = this.canvas.height / 2;
        this.ctx = this.canvas.getContext("2d");
    }

    public render() {
        this.canvas.width = this.canvas.width;

        for (let i in this.entities) {
            if (!(this.entities[i] instanceof CharacterCEntity)) continue;

            let entity = this.entities[i] as CharacterCEntity;

            this.ctx.beginPath();
            this.ctx.arc(entity.transform.x, this.yOffset, this.radius, 0, 2*Math.PI, false);
            this.ctx.fillStyle = entity.color.value;
            this.ctx.fill();
        }
    }
}