import "pixi.js"
import { Context } from "./Context";
import { ApplicationOptions } from "pixi.js";

import { Time } from "../utils/Time";

export class GameApplication extends PIXI.Application {
    private states: { [id:string]: new (GameApplication) => Context } = {};
    private context: Context;
    private updateInterval:NodeJS.Timer;


    constructor(options?: ApplicationOptions) {
        super(options);
        this.ticker.add(() => this.internalUpdate());

        // this.updateInterval = global.setInterval(
        //     (delta:number) => this.internalUpdate(delta),
        //     1000 / 60
        // );
    }

    public internalUpdate() {
        Time.currentTime = +new Date();
        Time.delta = Time.currentTime - (Time.lastTime || Time.currentTime);
        this.update(Time.delta);

        Time.lastTime = Time.currentTime;
    }

    public resize(width:number, height:number):void {
        this.renderer.resize(width, height);

        if (this.context) {
            this.context.onResize();
        }
    }

    public registerContext(key:string, context:new (GameApplication) => Context):void {
        this.states[key] = context;
    }

    public changeContext(key:string, data?:any):void {
        this.context = new this.states[key](this);
        this.context.enter(data);
    }

    private update(delta:number):void {
        if (!this.context) return;

        this.context.update(delta);
    }
}