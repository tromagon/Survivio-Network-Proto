import { GameApplication } from "./GameApplication";

export class Context {
    protected gameApplication:GameApplication;

    constructor(gameApplication:GameApplication) {
        this.gameApplication = gameApplication;
    }

    public enter(data?:any) {}
    public update(delta:number) {}
    public onResize() {}
}