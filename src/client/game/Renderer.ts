import { Camera } from "./Camera";
import { Container } from "pixi.js";
import { GameObjectView } from "./GameObjectView";

export class Renderer {
    private stage:Container;
    private camera:Camera;
    public worldObjectViews: Array<GameObjectView> = new Array<GameObjectView>();

    constructor(stage:Container, camera:Camera) {
        this.stage = stage;
        this.camera = camera;
    }

    public add(worldObjectView:GameObjectView):void {
        this.stage.addChild(worldObjectView.container);
        this.worldObjectViews.push(worldObjectView);
    }

    public remove(worldObjectView:GameObjectView):void {
        this.stage.removeChild(worldObjectView.container);
        this.worldObjectViews.splice(this.worldObjectViews.indexOf(worldObjectView), 1);
    }

    public update(delta:number):void {
        let l = this.worldObjectViews.length;
        for (let i = 0; i < l; ++i) {
            let worldObjectView = this.worldObjectViews[i];
            worldObjectView.container.x = worldObjectView.transform.x - this.camera.x + Math.floor(this.camera.viewport.width / 2);
            worldObjectView.container.y = worldObjectView.transform.y - this.camera.y + Math.floor(this.camera.viewport.height / 2);
            worldObjectView.container.rotation = worldObjectView.transform.rotation;
        }
    }   
}