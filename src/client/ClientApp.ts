import { GameApplication } from './context/GameApplication';
import { PreloaderContext } from './context/PreloadContext';
import { GameContext } from './context/GameContext';
import { LobbyContext } from './context/LobbyContext';

export class ClientApp extends GameApplication {
    constructor() {
        super({
            width : 256,
            height: 256,
            antialias: true,
            transparent: false,
            resolution: 1,
            forceCanvas: true,
            backgroundColor: 0x428b98,
        });

        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.resize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.view);

        this.registerContext(PreloaderContext.ID, PreloaderContext);
        this.registerContext(LobbyContext.ID, LobbyContext);
        this.registerContext(GameContext.ID, GameContext);
        this.changeContext(PreloaderContext.ID);

        window.onresize = () => {
            this.resize(window.innerWidth, window.innerHeight);
        }
    }
}