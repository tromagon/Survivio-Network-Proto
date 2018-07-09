import { Context } from "./Context";
import { LoaderUtils } from '../utils/LoaderUtils';
import { LobbyContext } from "./LobbyContext";

export class PreloaderContext extends Context {
    public static readonly ID = 'Preloader.ID';

    public enter() {
        LoaderUtils.loadAllAssets(PIXI.loader, this.onComplete, this);
    }

    private onComplete():void {
        this.gameApplication.changeContext(LobbyContext.ID);
    }
}